import { Button } from "@/components/Shared/UI";

interface SubmitActionsProps {
  disabled: boolean;
  loading: boolean;
  isComment: boolean;
  handleSubmit: () => void;
}

const SubmitActions = ({
  disabled,
  loading,
  isComment,
  handleSubmit
}: SubmitActionsProps) => (
  <div className="mt-2 ml-auto sm:mt-0">
    <Button disabled={disabled} loading={loading} onClick={handleSubmit}>
      {isComment ? "Comment" : "Post"}
    </Button>
  </div>
);

export default SubmitActions;
