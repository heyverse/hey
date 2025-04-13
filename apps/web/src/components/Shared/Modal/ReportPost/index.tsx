import {
  Button,
  EmptyState,
  ErrorMessage,
  Form,
  Select,
  TextArea,
  useZodForm
} from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Errors } from "@hey/data/errors";
import convertToTitleCase from "@hey/helpers/convertToTitleCase";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { PostReportReason, useReportPostMutation } from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const ValidationSchema = z.object({
  additionalComment: z.string().max(260, {
    message: "Additional comments should not exceed 260 characters"
  })
});

interface ReportPostProps {
  postId?: string;
}

const ReportPost = ({ postId }: ReportPostProps) => {
  const { isSuspended } = useAccountStatus();
  const [reason, setReason] = useState("");

  const form = useZodForm({
    schema: ValidationSchema
  });

  const [createReport, { data, error, loading }] = useReportPostMutation({
    onError: (error) => errorToast(error)
  });

  const reportPost = async ({
    additionalComment
  }: z.infer<typeof ValidationSchema>) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    return await createReport({
      variables: {
        request: {
          additionalComment,
          post: postId,
          reason: reason as PostReportReason
        }
      }
    });
  };

  return (
    <div onClick={stopEventPropagation}>
      {data?.reportPost === null ? (
        <EmptyState
          hideCard
          icon={<CheckCircleIcon className="size-14" />}
          message="Publication reported"
        />
      ) : postId ? (
        <div className="p-5">
          <Form className="space-y-4" form={form} onSubmit={reportPost}>
            {error ? (
              <ErrorMessage error={error} title="Failed to report" />
            ) : null}
            <div>
              <div className="label">Type</div>
              <Select
                onChange={(value) => setReason(value)}
                options={[
                  {
                    disabled: true,
                    label: "Select type",
                    value: "Select type"
                  },
                  ...Object.entries(PostReportReason).map(([key, value]) => ({
                    label: convertToTitleCase(key),
                    value,
                    selected: reason === value
                  }))
                ]}
              />
            </div>
            {reason ? (
              <>
                <TextArea
                  label="Description"
                  placeholder="Please provide additional details"
                  {...form.register("additionalComment")}
                />
                <Button
                  className="flex w-full justify-center"
                  disabled={loading}
                  loading={loading}
                  type="submit"
                >
                  Report
                </Button>
              </>
            ) : null}
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default ReportPost;
