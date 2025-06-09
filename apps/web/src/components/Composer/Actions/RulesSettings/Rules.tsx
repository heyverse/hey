import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Button } from "@/components/Shared/UI";
import { usePostRulesStore } from "@/store/non-persisted/post/usePostRulesStore";
import type { FollowersOnlyPostRuleConfig } from "@hey/indexer";
import type { Dispatch, SetStateAction } from "react";

interface RulesProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const Rules = ({ setShowModal }: RulesProps) => {
  const { rules = {}, setRules } = usePostRulesStore();

  const handleToggle = (key: keyof FollowersOnlyPostRuleConfig) => {
    const updated = { ...rules };

    if (updated[key]) {
      delete updated[key];
    } else {
      updated[key] = true;
    }

    const hasAny = Object.keys(updated).length > 0;
    setRules(hasAny ? updated : undefined);
  };

  return (
    <>
      <div className="space-y-5 p-5">
        <ToggleWithHelper
          heading={
            <span className="font-semibold">
              Restrict <b>replies</b> to followers
            </span>
          }
          description="Only people who follow you can reply"
          on={!!rules.repliesRestricted}
          setOn={() => handleToggle("repliesRestricted")}
        />
        <ToggleWithHelper
          heading={
            <span className="font-semibold">
              Restrict <b>quotes</b> to followers
            </span>
          }
          description="Only people who follow you can quote this post"
          on={!!rules.quotesRestricted}
          setOn={() => handleToggle("quotesRestricted")}
        />
        <ToggleWithHelper
          heading={
            <span className="font-semibold">
              Restrict <b>reposts</b> to followers
            </span>
          }
          description="Only people who follow you can repost this"
          on={!!rules.repostRestricted}
          setOn={() => handleToggle("repostRestricted")}
        />
      </div>
      <div className="divider" />
      <div className="flex space-x-2 p-5">
        <Button
          className="ml-auto"
          onClick={() => {
            setRules(undefined);
            setShowModal(false);
          }}
          outline
        >
          Cancel
        </Button>
        <Button onClick={() => setShowModal(false)}>Save</Button>
      </div>
    </>
  );
};

export default Rules;
