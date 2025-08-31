import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router";
import ViewAccount from "@/components/Account";
import Bookmarks from "@/components/Bookmarks";
import Layout from "@/components/Common/Layout";
import Explore from "@/components/Explore";
import ViewGroup from "@/components/Group";
import GroupSettings from "@/components/Group/Settings";
import { default as GroupMonetizeSettings } from "@/components/Group/Settings/Monetize";
import { default as GroupPersonalizeSettings } from "@/components/Group/Settings/Personalize";
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
import AccountSettings from "@/components/Settings";
import BlockedSettings from "@/components/Settings/Blocked";
import DeveloperSettings from "@/components/Settings/Developer";
import FundsSettings from "@/components/Settings/Funds";
import ManagerSettings from "@/components/Settings/Manager";
import { default as AccountMonetizeSettings } from "@/components/Settings/Monetize";
import { default as AccountPersonalizeSettings } from "@/components/Settings/Personalize";
import SessionsSettings from "@/components/Settings/Sessions";
import UsernameSettings from "@/components/Settings/Username";
import Custom404 from "@/components/Shared/404";
import RewardsSettings from "./components/Settings/Rewards";
import Staff from "./components/Staff";

const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<Layout />} path="/">
          <Route element={<Home />} index />
          <Route element={<Explore />} path="explore" />
          <Route element={<Search />} path="search" />
          <Route element={<Groups />} path="groups" />
          <Route element={<Bookmarks />} path="bookmarks" />
          <Route element={<Notification />} path="notifications" />
          <Route element={<ViewAccount />} path="account/:address" />
          <Route element={<ViewAccount />} path="u/:username" />
          <Route path="g/:address">
            <Route element={<ViewGroup />} index />
            <Route path="settings">
              <Route element={<GroupSettings />} index />
              <Route
                element={<GroupPersonalizeSettings />}
                path="personalize"
              />
              <Route element={<GroupMonetizeSettings />} path="monetize" />
              <Route element={<RulesSettings />} path="rules" />
            </Route>
          </Route>
          <Route path="posts/:slug">
            <Route element={<ViewPost />} index />
            <Route element={<ViewPost />} path="quotes" />
          </Route>
          <Route path="settings">
            <Route element={<AccountSettings />} index />
            <Route
              element={<AccountPersonalizeSettings />}
              path="personalize"
            />
            <Route element={<AccountMonetizeSettings />} path="monetize" />
            <Route element={<RewardsSettings />} path="rewards" />
            <Route element={<BlockedSettings />} path="blocked" />
            <Route element={<DeveloperSettings />} path="developer" />
            <Route element={<FundsSettings />} path="funds" />
            <Route element={<ManagerSettings />} path="manager" />
            <Route element={<SessionsSettings />} path="sessions" />
            <Route element={<UsernameSettings />} path="username" />
          </Route>
          <Route path="staff">
            <Route element={<Staff />} index />
          </Route>
          <Route element={<Support />} path="support" />
          <Route element={<Terms />} path="terms" />
          <Route element={<Privacy />} path="privacy" />
          <Route element={<Guidelines />} path="guidelines" />
          <Route element={<Copyright />} path="copyright" />
          <Route element={<Custom404 />} path="*" />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
