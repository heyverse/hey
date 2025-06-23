import type { FollowersOnlyPostRuleConfig } from "@hey/indexer";
import type { Dispatch, SetStateAction } from "react";
import ProFeatureNotice from "@/components/Shared/ProFeatureNotice";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Button } from "@/components/Shared/UI";
import { usePostRulesStore } from "@/store/non-persisted/post/usePostRulesStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface RulesProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const Rules = ({ setShowModal }: RulesProps) => {
  const { currentAccount } = useAccountStore();
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
      {currentAccount?.hasSubscribed ? null : (
        <>
          <ProFeatureNotice className="m-5" feature="post rules settings" />
          <div className="divider" />
        </>
      )}
      <div className="m-5 space-y-5">
        <ToggleWithHelper
          description="Only people who follow you can reply"
          disabled={!currentAccount?.hasSubscribed}
          heading={
            <span className="font-semibold">
              Restrict <b>replies</b> to followers
            </span>
          }
          on={!!rules.repliesRestricted}
          setOn={() => handleToggle("repliesRestricted")}
        />
        <ToggleWithHelper
          description="Only people who follow you can quote this post"
          disabled={!currentAccount?.hasSubscribed}
          heading={
            <span className="font-semibold">
              Restrict <b>quotes</b> to followers
            </span>
          }
          on={!!rules.quotesRestricted}
          setOn={() => handleToggle("quotesRestricted")}
        />
        <ToggleWithHelper
          description="Only people who follow you can repost this"
          disabled={!currentAccount?.hasSubscribed}
          heading={
            <span className="font-semibold">
              Restrict <b>reposts</b> to followers
            </span>
          }
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
        {currentAccount?.hasSubscribed ? (
          <Button onClick={() => setShowModal(false)}>Save</Button>
        ) : null}
      </div>
    </>
  );
};

export default Rules;
