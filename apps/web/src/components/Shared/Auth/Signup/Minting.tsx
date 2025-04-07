import { H4, Spinner } from "@/components/Shared/UI";
import { useAccountQuery } from "@hey/indexer";
import { useSignupStore } from ".";

const Minting = () => {
  const { choosedUsername, setAccountAddress, setScreen, transactionHash } =
    useSignupStore();

  useAccountQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.account) {
        setAccountAddress(data.account.address);
        setScreen("success");
      }
    },
    pollInterval: 1500,
    skip: !transactionHash,
    variables: { request: { username: { localName: choosedUsername } } }
  });

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <H4>We are preparing your account!</H4>
      <div className="mt-3 text-center font-semibold text-gray-500 dark:text-gray-200">
        This will take a few seconds to a few minutes. Please be patient.
      </div>
      <Spinner className="mt-8" />
    </div>
  );
};

export default Minting;
