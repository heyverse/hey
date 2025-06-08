import cn from "@/helpers/cn";
import errorToast from "@/helpers/errorToast";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import {} from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { type PostFragment, useRefreshMetadataMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { toast } from "sonner";

interface RefreshMetadataProps {
  post: PostFragment;
}

const RefreshMetadata = ({ post }: RefreshMetadataProps) => {
  const [refreshMetadata] = useRefreshMetadataMutation({
    variables: { request: { entity: { post: post.id } } },
    onError: (error: ApolloClientError) => errorToast(error)
  });

  const handleRefreshMetadata = async () => {
    try {
      toast.promise(refreshMetadata(), {
        loading: "Refreshing metadata...",
        success: "Metadata refresh requested",
        error: "Failed to refresh metadata"
      });
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        handleRefreshMetadata();
      }}
    >
      <div className="flex items-center space-x-2">
        <ArrowPathIcon className="size-4" />
        <div>Refresh metadata</div>
      </div>
    </MenuItem>
  );
};

export default RefreshMetadata;
