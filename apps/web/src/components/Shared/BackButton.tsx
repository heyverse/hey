import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { memo, useCallback } from "react";
import { useNavigate, useNavigationType } from "react-router";

interface BackButtonProps {
  path?: string;
}

const BackButton = ({ path }: BackButtonProps) => {
  const navigate = useNavigate();
  const navType = useNavigationType();

  const handleBack = useCallback(() => {
    if (path) {
      navigate(path);
    } else if (navType === "POP") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }, [navType, navigate, path]);

  return (
    <button
      className="rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={handleBack}
      type="button"
    >
      <ArrowLeftIcon className="size-5" />
    </button>
  );
};

export default memo(BackButton);
