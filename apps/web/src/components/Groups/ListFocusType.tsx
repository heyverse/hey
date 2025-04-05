import type { Dispatch, SetStateAction } from "react";
import { GroupsTabFocus } from ".";
import { TabButton } from "../Shared/UI";

interface ListFocusTypeProps {
  focus?: GroupsTabFocus;
  setFocus: Dispatch<SetStateAction<GroupsTabFocus>>;
}

const ListFocusType = ({ focus, setFocus }: ListFocusTypeProps) => (
  <div className="mx-5 flex flex-wrap gap-3 sm:mx-0">
    <TabButton
      active={focus === GroupsTabFocus.Member}
      name="Your groups"
      onClick={() => setFocus(GroupsTabFocus.Member)}
    />
    <TabButton
      active={focus === GroupsTabFocus.Managed}
      name="Managed groups"
      onClick={() => setFocus(GroupsTabFocus.Managed)}
    />
  </div>
);

export default ListFocusType;
