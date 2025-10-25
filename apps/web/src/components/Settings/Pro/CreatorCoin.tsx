import { MeVariables, ZORA_API_KEY } from "@hey/data/constants";
import { Regex } from "@hey/data/regex";
import { useMeLazyQuery, useSetAccountMetadataMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { account as accountMetadata } from "@lens-protocol/metadata";
import { useQuery } from "@tanstack/react-query";
import {
  type GetCoinResponse,
  getCoin,
  getProfileCoins,
  setApiKey
} from "@zoralabs/coins-sdk";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { base } from "viem/chains";
import { z } from "zod";
import MetaDetails from "@/components/Account/MetaDetails";
import {
  Button,
  Card,
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

  const savedCreatorCoinAddress = getAccountAttribute(
    "creatorCoinAddress",
    currentAccount?.metadata?.attributes
  );

  const form = useZodForm({
    defaultValues: { creatorCoinAddress: savedCreatorCoinAddress },
    schema: ValidationSchema
  });

  const creatorCoinAddress = form.watch("creatorCoinAddress");
  const isValidAddress = Regex.evmAddress.test(creatorCoinAddress || "");

  useEffect(() => {
    form.setValue("creatorCoinAddress", savedCreatorCoinAddress);
  }, [savedCreatorCoinAddress, form]);

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

  const { data: creatorCoinFromZora } = useQuery<string | null>({
    enabled: !!currentAccount?.owner && !creatorCoinAddress,
    queryFn: async () => {
      const res = await getProfileCoins({
        identifier: currentAccount?.owner as string
      });

      return res.data?.profile?.creatorCoin?.address ?? null;
    },
    queryKey: ["profileCoins", currentAccount?.owner]
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

  const handleRemove = async () => {
    if (!currentAccount) return;

    setIsSubmitting(true);
    const preparedAccountMetadata = prepareAccountMetadata(currentAccount, {
      attributes: { creatorCoinAddress: undefined }
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
      {!savedCreatorCoinAddress && creatorCoinFromZora ? (
        <Card className="p-5">
          <div className="space-y-1">
            <div>You have a creator coin available to set</div>
            <button
              className="text-gray-500 text-sm underline"
              onClick={() => {
                form.setValue("creatorCoinAddress", creatorCoinFromZora, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true
                });
              }}
              type="button"
            >
              {creatorCoinFromZora}
            </button>
          </div>
        </Card>
      ) : null}
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
      <div className="flex space-x-2">
        {savedCreatorCoinAddress ? (
          <Button
            className="w-full"
            disabled={
              isSubmitting || (!creatorCoinAddress && !savedCreatorCoinAddress)
            }
            loading={isSubmitting}
            onClick={handleRemove}
            outline
            type="button"
          >
            Remove
          </Button>
        ) : null}
        <Button
          className="w-full"
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
