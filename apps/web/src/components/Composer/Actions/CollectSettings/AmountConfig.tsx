import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { tokens } from "@hey/data/tokens";
import type { CollectActionType } from "@hey/types/hey";
import { motion } from "motion/react";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Input, Select } from "@/components/Shared/UI";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { EXPANSION_EASE } from "@/variants";

interface AmountConfigProps {
  setCollectType: (data: CollectActionType) => void;
}

const AmountConfig = ({ setCollectType }: AmountConfigProps) => {
  const { currentAccount } = useAccountStore();
  const { collectAction } = useCollectActionStore((state) => state);

  const enabled = Boolean(collectAction.payToCollect?.erc20?.value);

  return (
    <div>
      <ToggleWithHelper
        description="Get paid whenever someone collects your post"
        heading="Charge for collecting"
        icon={<CurrencyDollarIcon className="size-5" />}
        on={enabled}
        setOn={() => {
          setCollectType({
            payToCollect: enabled
              ? undefined
              : {
                  erc20: { currency: DEFAULT_COLLECT_TOKEN, value: "1" },
                  recipients: [
                    { address: currentAccount?.address, percent: 100 }
                  ], // 2.45% for the Hey platform fees after the 1.5% lens fees cut
                  referralShare: 3
                }
          });
        }}
      />
      {collectAction.payToCollect?.erc20?.value ? (
        <motion.div
          animate="visible"
          className="mt-4 ml-8"
          initial="hidden"
          transition={{ duration: 0.2, ease: EXPANSION_EASE }}
          variants={{
            hidden: { height: 0, opacity: 0, y: -20 },
            visible: { height: "auto", opacity: 1, y: 0 }
          }}
        >
          <div className="flex space-x-2 text-sm">
            <Input
              label="Price"
              max="100000"
              min="0"
              onChange={(event) => {
                if (!collectAction.payToCollect) return;
                setCollectType({
                  payToCollect: {
                    ...collectAction.payToCollect,
                    erc20: {
                      currency: collectAction.payToCollect?.erc20?.currency,
                      value: event.target.value ? event.target.value : "0"
                    }
                  }
                });
              }}
              placeholder="0.5"
              type="number"
              value={Number.parseFloat(collectAction.payToCollect?.erc20.value)}
            />
            <div className="w-5/6">
              <div className="label">Select currency</div>
              <Select
                iconClassName="size-4 rounded-full"
                onChange={(value) => {
                  if (!collectAction.payToCollect) return;
                  setCollectType({
                    payToCollect: {
                      ...collectAction.payToCollect,
                      erc20: {
                        currency: value,
                        value: collectAction.payToCollect?.erc20
                          ?.value as string
                      }
                    }
                  });
                }}
                options={tokens.map((token) => ({
                  icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol.toLowerCase()}.svg`,
                  label: token.name,
                  selected:
                    token.contractAddress ===
                    collectAction.payToCollect?.erc20?.currency,
                  value: token.contractAddress
                }))}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
};

export default AmountConfig;
