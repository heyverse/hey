import errorToast from "@/helpers/errorToast";
import uploadMetadata from "@/helpers/uploadMetadata";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Errors } from "@hey/data/errors";
import { type GroupFragment, useSetGroupMetadataMutation } from "@hey/indexer";
import { group as groupMetadata } from "@lens-protocol/metadata";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const useUpdateGroupMetadata = (group: GroupFragment) => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = useCallback(() => {
    setIsSubmitting(false);
    toast.success("Group updated");
  }, []);

  const onError = useCallback((error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [setGroupMetadata] = useSetGroupMetadataMutation({
    onCompleted: async ({ setGroupMetadata }) => {
      if (setGroupMetadata.__typename === "SetGroupMetadataResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: setGroupMetadata,
        onCompleted,
        onError
      });
    },
    onError
  });

  const updateGroup = useCallback(
    async (
      data: { name: string; description: string },
      pfpUrl: string | undefined,
      coverUrl: string | undefined
    ) => {
      if (!currentAccount) {
        toast.error(Errors.SignWallet);
        return;
      }

      setIsSubmitting(true);

      const metadataUri = await uploadMetadata(
        groupMetadata({
          name: data.name,
          description: data.description,
          icon: pfpUrl || undefined,
          coverPicture: coverUrl || undefined
        })
      );

      await setGroupMetadata({
        variables: { request: { group: group.address, metadataUri } }
      });
    },
    [currentAccount, setGroupMetadata, group.address]
  );

  return { updateGroup, isSubmitting };
};

export default useUpdateGroupMetadata;
