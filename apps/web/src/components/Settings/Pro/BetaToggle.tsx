import { PERMISSIONS } from "@hey/data/constants";
import ProToggle from "./ProToggle";

const BetaToggle = () => (
  <ProToggle
    description="Get early access to new features"
    group={PERMISSIONS.BETA}
    heading="Beta"
    selectIsOn={(account) => account.isBeta}
  />
);

export default BetaToggle;
