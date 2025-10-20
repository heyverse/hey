import { PERMISSIONS } from "@hey/data/constants";
import ProToggle from "./ProToggle";

const DefaultToNameToggle = () => (
  <ProToggle
    description="Show profile name instead of username across the feeds"
    group={PERMISSIONS.PREFER_NAME_IN_FEED}
    heading="Prefer profile name"
    selectIsOn={(account) => account.preferNameInFeed}
  />
);

export default DefaultToNameToggle;
