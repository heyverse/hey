import { MeVariables, ZORA_API_KEY } from "@hey/data/constants";
import { Regex } from "@hey/data/regex";
import { useMeLazyQuery, useSetAccountMetadataMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { account as accountMetadata } from "@lens-protocol/metadata";
import { useQuery } from "@tanstack/react-query";
import { type GetCoinResponse, getCoin, setApiKey } from "@zoralabs/coins-sdk";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { base } from "viem/chains";
import { z } from "zod";
import MetaDetails from "@/components/Account/MetaDetails";
import {
  Button,
  Form,
  Image,
  Input,
  Spinner,
  useZodForm
} from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import getAccountAttribute from "@/helpers/getAccountAttribute";
import prepareAccountMetadata from "@/helpers/prepareAccountMetadata";
import uploadMetadata from "@/helpers/uploadMetadata";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import { useAccountStore } from "@/store/persisted/useAccountStore";

setApiKey(ZORA_API_KEY);

const ValidationSchema = z.object({
  creatorCoinAddress: z.union([
    z.string().regex(Regex.evmAddress, { message: "Invalid address" }),
    z.string().max(0)
  ])
});

const CreatorCoin = () => {
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();
  const [getCurrentAccountDetails] = useMeLazyQuery({
    fetchPolicy: "no-cache",
    variables: MeVariables
  });

  const onCompleted = async (hash: string) => {
    await waitForTransactionToComplete(hash);
    const accountData = await getCurrentAccountDetails();
    setCurrentAccount(accountData?.data?.me.loggedInAs.account);
    setIsSubmitting(false);
    toast.success("Creator coin address updated");
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [setAccountMetadata] = useSetAccountMetadataMutation({
    onCompleted: async ({ setAccountMetadata }) => {
      if (setAccountMetadata.__typename === "SetAccountMetadataResponse") {
        return await onCompleted(setAccountMetadata.hash);
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: setAccountMetadata
      });
    },
    onError
  });

  const form = useZodForm({
    defaultValues: {
      creatorCoinAddress: getAccountAttribute(
        "creatorCoinAddress",
        currentAccount?.metadata?.attributes
      )
    },
    schema: ValidationSchema
  });

  const creatorCoinAddress = form.watch("creatorCoinAddress");
  const isValidAddress = Regex.evmAddress.test(creatorCoinAddress || "");

  useEffect(() => {
    if (!creatorCoinAddress) return;
    const match = creatorCoinAddress.match(/0x[\da-fA-F]{40}/);
    if (match?.[0] && match[0] !== creatorCoinAddress) {
      form.setValue("creatorCoinAddress", match[0], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    }
  }, [creatorCoinAddress, form]);

  const { data: coin, isFetching: isFetchingCoin } = useQuery<
    GetCoinResponse["zora20Token"] | null
  >({
    enabled: isValidAddress,
    queryFn: async () => {
      const res = await getCoin({
        address: creatorCoinAddress as string,
        chain: base.id
      });
      return res.data?.zora20Token ?? null;
    },
    queryKey: ["coin", creatorCoinAddress]
  });

  const onSubmit = async (data: z.infer<typeof ValidationSchema>) => {
    if (!currentAccount) return;

    setIsSubmitting(true);
    const preparedAccountMetadata = prepareAccountMetadata(currentAccount, {
      attributes: { creatorCoinAddress: data.creatorCoinAddress }
    });

    const metadataUri = await uploadMetadata(
      accountMetadata(preparedAccountMetadata)
    );

    return await setAccountMetadata({
      variables: { request: { metadataUri } }
    });
  };

  return (
    <Form className="space-y-3" form={form} onSubmit={onSubmit}>
      <Input
        label="Creator Coin Address"
        placeholder="0x..."
        type="text"
        {...form.register("creatorCoinAddress")}
      />
      {isValidAddress && (
        <>
          {isFetchingCoin && (
            <MetaDetails icon={<Spinner className="size-4" />}>
              Fetching...
            </MetaDetails>
          )}
          {!isFetchingCoin && coin && (
            <MetaDetails
              icon={
                <Image
                  alt={coin.name}
                  className="size-4 rounded-full"
                  height={16}
                  src={coin.mediaContent?.previewImage?.medium}
                  width={16}
                />
              }
            >
              ${coin.symbol}
            </MetaDetails>
          )}
          {!isFetchingCoin && !coin && (
            <div className="text-red-500 text-sm">Coin not found</div>
          )}
        </>
      )}
      <div className="flex justify-end">
        <Button
          className="ml-auto"
          disabled={
            isSubmitting || !form.formState.isDirty || !isValidAddress || !coin
          }
          loading={isSubmitting}
          type="submit"
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CreatorCoin;
