import { useAccountStore } from "@/store/persisted/useAccountStore";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import SignedAccount from "./SignedAccount";

const MenuItems = () => {
  const { currentAccount } = useAccountStore();

  if (currentAccount) {
    return <SignedAccount />;
  }

  return (
    <button onClick={() => {}} type="button">
      <UserCircleIcon className="size-6" />
    </button>
  );
};

export default MenuItems;
