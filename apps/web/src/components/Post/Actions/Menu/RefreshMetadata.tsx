import cn from "@/helpers/cn";
import errorToast from "@/helpers/errorToast";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { gql, useMutation } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type { PostFragment } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { toast } from "sonner";

interface RefreshMetadataProps {
  post: PostFragment;
}

const RefreshMetadata = ({ post }: RefreshMetadataProps) => {
  const [refreshMetadata] = useMutation(
    gql`
      mutation RefreshMetadata($request: RefreshMetadataRequest!) {
        refreshMetadata(request: $request) {
          id
        }
      }
    `,
    {
      onCompleted: () => toast.success("Metadata refresh requested"),
      onError: (error: ApolloClientError) => errorToast(error),
      variables: { request: { entity: post.id } }
    }
  );

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
        refreshMetadata();
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
