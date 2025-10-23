import { Regex } from "@hey/data/regex";
import { useSetAccountMetadataMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { account as accountMetadata } from "@lens-protocol/metadata";
import { useCallback, useState } from "react";
import { z } from "zod";
import { Button, Form, Input, useZodForm } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import getAccountAttribute from "@/helpers/getAccountAttribute";
import prepareAccountMetadata from "@/helpers/prepareAccountMetadata";
import uploadMetadata from "@/helpers/uploadMetadata";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const ValidationSchema = z.object({
  creatorCoinAddress: z.union([
    z.string().regex(Regex.evmAddress, { message: "Invalid address" }),
    z.string().max(0)
  ])
});

const CreatorCoin = () => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();

  const onCompleted = async (hash: string) => {
    await waitForTransactionToComplete(hash);
    location.reload();
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
      <div className="flex justify-end">
        <Button
          className="ml-auto"
          disabled={isSubmitting || !form.formState.isDirty}
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
