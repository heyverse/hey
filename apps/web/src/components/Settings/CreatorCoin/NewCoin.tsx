import { ZORA_API_KEY } from "@hey/data/constants";
import { setApiKey } from "@zoralabs/coins-sdk";
import { Card } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";

setApiKey(ZORA_API_KEY);

const NewCoin = () => {
  const { currentAccount } = useAccountStore();

  return (
    <Card className="p-5">
      <div className="space-y-1">
        <div>You have a creator coin available to set</div>
        <button className="text-gray-500 text-sm underline" type="button">
          {currentAccount?.address}
        </button>
      </div>
    </Card>
  );
};

export default NewCoin;
