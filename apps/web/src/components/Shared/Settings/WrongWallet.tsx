import WalletSelector from "@/components/Shared/Auth/WalletSelector";
import { H5 } from "@/components/Shared/UI";

const WrongWallet = () => {
  return (
    <div className="space-y-2 p-5">
      <div className="space-y-3 pb-2">
        <H5>Switch to correct wallet</H5>
        <p>
          You need to switch to correct wallet to manage this account. Please
          switch to the correct wallet to manage this account.
        </p>
      </div>
      <WalletSelector />
    </div>
  );
};

export default WrongWallet;
