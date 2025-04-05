import ViewProfile from "@/components/Account";
import Bookmarks from "@/components/Bookmarks";
import Layout from "@/components/Common/Layout";
import Explore from "@/components/Explore";
import ViewGroup from "@/components/Group";
import GroupSettings from "@/components/Group/Settings/Overview";
import RulesSettings from "@/components/Group/Settings/Rules";
import Groups from "@/components/Groups";
import Home from "@/components/Home";
import Notification from "@/components/Notification";
import Copyright from "@/components/Pages/Copyright";
import Guidelines from "@/components/Pages/Guidelines";
import Privacy from "@/components/Pages/Privacy";
import Support from "@/components/Pages/Support";
import Terms from "@/components/Pages/Terms";
import ViewPost from "@/components/Post";
import Search from "@/components/Search";
import AccountSettings from "@/components/Settings/Account";
import BlockedSettings from "@/components/Settings/Blocked";
import DangerSettings from "@/components/Settings/Danger";
import DeveloperSettings from "@/components/Settings/Developer";
import FundsSettings from "@/components/Settings/Funds";
import ManagerSettings from "@/components/Settings/Manager";
import PreferencesSettings from "@/components/Settings/Preferences";
import ProfileSettings from "@/components/Settings/Profile";
import SessionsSettings from "@/components/Settings/Sessions";
import UsernameSettings from "@/components/Settings/Username";
import Custom404 from "@/components/Shared/404";
import Accounts from "@/components/Staff/Accounts";
import StaffAccountOverview from "@/components/Staff/Accounts/Overview";
import StaffOverview from "@/components/Staff/Overview";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router";

export const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="account/:address" element={<ViewProfile />} />
          <Route path="explore" element={<Explore />} />
          <Route path="search" element={<Search />} />
          <Route path="groups" element={<Groups />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="u/:username" element={<ViewProfile />} />
          <Route path="g/:address">
            <Route index element={<ViewGroup />} />
            <Route path="settings">
              <Route index element={<GroupSettings />} />
              <Route path="rules" element={<RulesSettings />} />
            </Route>
          </Route>
          <Route path="posts/:slug">
            <Route index element={<ViewPost />} />
            <Route path="quotes" element={<ViewPost />} />
          </Route>
          <Route path="settings">
            <Route index element={<ProfileSettings />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="blocked" element={<BlockedSettings />} />
            <Route path="danger" element={<DangerSettings />} />
            <Route path="developer" element={<DeveloperSettings />} />
            <Route path="funds" element={<FundsSettings />} />
            <Route path="manager" element={<ManagerSettings />} />
            <Route path="preferences" element={<PreferencesSettings />} />
            <Route path="sessions" element={<SessionsSettings />} />
            <Route path="username" element={<UsernameSettings />} />
          </Route>
          <Route path="staff">
            <Route index element={<StaffOverview />} />
            <Route path="accounts">
              <Route index element={<Accounts />} />
              <Route path=":address" element={<StaffAccountOverview />} />
            </Route>
          </Route>
          <Route path="support" element={<Support />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="guidelines" element={<Guidelines />} />
          <Route path="copyright" element={<Copyright />} />
          <Route path="*" element={<Custom404 />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
};
