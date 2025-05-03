import KeyboardShortcuts from "@/helpers/shortcuts";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import getAccount from "@hey/helpers/getAccount";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";

const GlobalShortcuts = () => {
  const navigate = useNavigate();
  const { currentAccount } = useAccountStore();

  // Go to account
  useHotkeys(KeyboardShortcuts.GoToAccount.key, () => {
    navigate(getAccount(currentAccount).link);
  });

  // Go to home
  useHotkeys(KeyboardShortcuts.GoToHome.key, () => {
    navigate("/");
  });

  // Go to explore
  useHotkeys(KeyboardShortcuts.GoToExplore.key, () => {
    navigate("/explore");
  });

  // Go to notifications
  useHotkeys(KeyboardShortcuts.GoToNotifications.key, () => {
    navigate("/notifications");
  });

  // Go to search
  useHotkeys(KeyboardShortcuts.GoToSearch.key, () => {
    navigate("/search");
  });

  return null;
};

export default GlobalShortcuts;
