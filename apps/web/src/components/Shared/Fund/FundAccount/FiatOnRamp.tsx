import { STATIC_IMAGES_URL } from "@hey/data/constants";
import type { FC } from "react";
import { createThirdwebClient } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { PayEmbed } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "0e8fa22aa33b3da60c593b4864a2e2d1"
});

interface FiatOnRampProps {
  amount: string;
  recipient: string;
  onSuccess: () => void;
}

const FiatOnRamp: FC<FiatOnRampProps> = ({ amount, recipient, onSuccess }) => {
  return (
    <PayEmbed
      client={client}
      theme="light"
      style={{
        width: "100%",
        border: "none",
        backgroundColor: "transparent"
      }}
      payOptions={{
        mode: "direct_payment",
        metadata: { name: "Buy Gho Token" },
        buyWithFiat: { preferredProvider: "COINBASE" },
        buyWithCrypto: false,
        paymentInfo: {
          amount: amount.toString(),
          chain: ethereum,
          sellerAddress: recipient,
          token: {
            address: "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f",
            name: "GHO",
            symbol: "GHO",
            icon: `${STATIC_IMAGES_URL}/tokens/gho.svg`
          }
        },
        onPurchaseSuccess: () => {
          onSuccess?.();
        }
      }}
    />
  );
};

export default FiatOnRamp;
