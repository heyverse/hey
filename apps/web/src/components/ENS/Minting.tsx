import { HEY_ENS_NAMESPACE } from "@hey/data/constants";
import { useUsernameQuery } from "@hey/indexer";
import { Card, H4, Spinner } from "@/components/Shared/UI";
import { useENSCreateStore } from ".";

const Minting = () => {
  const { setScreen, transactionHash, chosenUsername, setChosenUsername } =
    useENSCreateStore();

  useUsernameQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.username) {
        setChosenUsername(data.username.localName);
        setScreen("success");
      }
    },
    pollInterval: 1500,
    skip: !transactionHash,
    variables: {
      request: {
        username: { localName: chosenUsername, namespace: HEY_ENS_NAMESPACE }
      }
    }
  });

  return (
    <Card className="flex flex-col items-center justify-center p-5">
      <H4>We are minting your ENS name!</H4>
      <div className="mt-3 text-center font-semibold text-gray-500 dark:text-gray-200">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
    </Card>
  );
};

export default Minting;
