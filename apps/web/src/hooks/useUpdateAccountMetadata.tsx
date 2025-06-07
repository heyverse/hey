import errorToast from "@/helpers/errorToast";
import trimify from "@/helpers/trimify";
import uploadMetadata from "@/helpers/uploadMetadata";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Errors } from "@hey/data/errors";
import { useMeLazyQuery, useSetAccountMetadataMutation } from "@hey/indexer";
import type {
  AccountOptions,
  MetadataAttribute
} from "@lens-protocol/metadata";
import {
  MetadataAttributeType,
  account as accountMetadata
} from "@lens-protocol/metadata";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const useUpdateAccountMetadata = () => {
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();
  const [getCurrentAccountDetails] = useMeLazyQuery({
    fetchPolicy: "no-cache"
  });

  const onCompleted = useCallback(
    (hash: string) => {
      pollTransactionStatus(hash, async () => {
        const accountData = await getCurrentAccountDetails();
        setCurrentAccount(accountData?.data?.me.loggedInAs.account);
        setIsSubmitting(false);
        toast.success("Account updated");
      });
    },
    [pollTransactionStatus, getCurrentAccountDetails, setCurrentAccount]
  );

  const onError = useCallback((error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [setAccountMetadata] = useSetAccountMetadataMutation({
    onCompleted: async ({ setAccountMetadata }) => {
      if (setAccountMetadata.__typename === "SetAccountMetadataResponse") {
        return onCompleted(setAccountMetadata.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: setAccountMetadata,
        onCompleted,
        onError
      });
    },
    onError
  });

  const updateAccount = useCallback(
    async (
      data: {
        bio: string;
        location: string;
        name: string;
        website: string;
        x: string;
      },
      pfpUrl: string | undefined,
      coverUrl: string | undefined
    ) => {
      if (!currentAccount) {
        toast.error(Errors.SignWallet);
        return;
      }

      setIsSubmitting(true);
      const otherAttributes =
        currentAccount.metadata?.attributes
          ?.filter(
            (attr) =>
              !["app", "location", "timestamp", "website", "x"].includes(
                attr.key
              )
          )
          .map(({ key, type, value }) => ({
            key,
            type: MetadataAttributeType[type] as any,
            value
          })) || [];

      const preparedAccountMetadata: AccountOptions = {
        ...(data.name && { name: data.name }),
        ...(data.bio && { bio: data.bio }),
        attributes: [
          ...(otherAttributes as MetadataAttribute[]),
          {
            key: "location",
            type: MetadataAttributeType.STRING,
            value: data.location
          },
          {
            key: "website",
            type: MetadataAttributeType.STRING,
            value: data.website
          },
          { key: "x", type: MetadataAttributeType.STRING, value: data.x },
          {
            key: "timestamp",
            type: MetadataAttributeType.STRING,
            value: new Date().toISOString()
          }
        ],
        coverPicture: coverUrl || undefined,
        picture: pfpUrl || undefined
      };

      preparedAccountMetadata.attributes =
        preparedAccountMetadata.attributes?.filter((m) => {
          return m.key !== "" && Boolean(trimify(m.value));
        });

      const metadataUri = await uploadMetadata(
        accountMetadata(preparedAccountMetadata)
      );

      await setAccountMetadata({ variables: { request: { metadataUri } } });
    },
    [currentAccount, setAccountMetadata]
  );

  return { updateAccount, isSubmitting };
};

export default useUpdateAccountMetadata;
