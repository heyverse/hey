import { useAccountStore } from "@/store/persisted/useAccountStore";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import SignedAccount from "./SignedAccount";

export const NextLink = ({ children, to, ...rest }: Record<string, any>) => (
  <Link to={to} {...rest}>
    {children}
  </Link>
);

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
