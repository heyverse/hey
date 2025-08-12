import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router";
import Layout from "@/components/Common/Layout";
import FullPageLoader from "@/components/Shared/FullPageLoader";

// Lazy load components for better performance
const ViewAccount = lazy(() => import("@/components/Account"));
const Bookmarks = lazy(() => import("@/components/Bookmarks"));
const Explore = lazy(() => import("@/components/Explore"));
const ViewGroup = lazy(() => import("@/components/Group"));
const GroupSettings = lazy(() => import("@/components/Group/Settings"));
const GroupMonetizeSettings = lazy(
  () => import("@/components/Group/Settings/Monetize")
);
const GroupPersonalizeSettings = lazy(
  () => import("@/components/Group/Settings/Personalize")
);
const RulesSettings = lazy(() => import("@/components/Group/Settings/Rules"));
const Groups = lazy(() => import("@/components/Groups"));
const Home = lazy(() => import("@/components/Home"));
const Notification = lazy(() => import("@/components/Notification"));
const Copyright = lazy(() => import("@/components/Pages/Copyright"));
const Guidelines = lazy(() => import("@/components/Pages/Guidelines"));
const Privacy = lazy(() => import("@/components/Pages/Privacy"));
const Support = lazy(() => import("@/components/Pages/Support"));
const Terms = lazy(() => import("@/components/Pages/Terms"));
const ViewPost = lazy(() => import("@/components/Post"));
const Search = lazy(() => import("@/components/Search"));
const AccountSettings = lazy(() => import("@/components/Settings"));
const BlockedSettings = lazy(() => import("@/components/Settings/Blocked"));
const DeveloperSettings = lazy(() => import("@/components/Settings/Developer"));
const FundsSettings = lazy(() => import("@/components/Settings/Funds"));
const ManagerSettings = lazy(() => import("@/components/Settings/Manager"));
const AccountMonetizeSettings = lazy(
  () => import("@/components/Settings/Monetize")
);
const AccountPersonalizeSettings = lazy(
  () => import("@/components/Settings/Personalize")
);
const PreferencesSettings = lazy(
  () => import("@/components/Settings/Preferences")
);
const SessionsSettings = lazy(() => import("@/components/Settings/Sessions"));
const UsernameSettings = lazy(() => import("@/components/Settings/Username"));
const Custom404 = lazy(() => import("@/components/Shared/404"));
const RewardsSettings = lazy(() => import("./components/Settings/Rewards"));
const Staff = lazy(() => import("./components/Staff"));

const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<Layout />} path="/">
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Home />
              </Suspense>
            }
            index
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Explore />
              </Suspense>
            }
            path="explore"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Search />
              </Suspense>
            }
            path="search"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Groups />
              </Suspense>
            }
            path="groups"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Bookmarks />
              </Suspense>
            }
            path="bookmarks"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Notification />
              </Suspense>
            }
            path="notifications"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <ViewAccount />
              </Suspense>
            }
            path="account/:address"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <ViewAccount />
              </Suspense>
            }
            path="u/:username"
          />
          <Route path="g/:address">
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <ViewGroup />
                </Suspense>
              }
              index
            />
            <Route path="settings">
              <Route
                element={
                  <Suspense fallback={<FullPageLoader />}>
                    <GroupSettings />
                  </Suspense>
                }
                index
              />
              <Route
                element={
                  <Suspense fallback={<FullPageLoader />}>
                    <GroupPersonalizeSettings />
                  </Suspense>
                }
                path="personalize"
              />
              <Route
                element={
                  <Suspense fallback={<FullPageLoader />}>
                    <GroupMonetizeSettings />
                  </Suspense>
                }
                path="monetize"
              />
              <Route
                element={
                  <Suspense fallback={<FullPageLoader />}>
                    <RulesSettings />
                  </Suspense>
                }
                path="rules"
              />
            </Route>
          </Route>
          <Route path="posts/:slug">
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <ViewPost />
                </Suspense>
              }
              index
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <ViewPost />
                </Suspense>
              }
              path="quotes"
            />
          </Route>
          <Route path="settings">
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <AccountSettings />
                </Suspense>
              }
              index
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <AccountPersonalizeSettings />
                </Suspense>
              }
              path="personalize"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <AccountMonetizeSettings />
                </Suspense>
              }
              path="monetize"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <RewardsSettings />
                </Suspense>
              }
              path="rewards"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <BlockedSettings />
                </Suspense>
              }
              path="blocked"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <DeveloperSettings />
                </Suspense>
              }
              path="developer"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <FundsSettings />
                </Suspense>
              }
              path="funds"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <ManagerSettings />
                </Suspense>
              }
              path="manager"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <PreferencesSettings />
                </Suspense>
              }
              path="preferences"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <SessionsSettings />
                </Suspense>
              }
              path="sessions"
            />
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <UsernameSettings />
                </Suspense>
              }
              path="username"
            />
          </Route>
          <Route path="staff">
            <Route
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <Staff />
                </Suspense>
              }
              index
            />
          </Route>
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Support />
              </Suspense>
            }
            path="support"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Terms />
              </Suspense>
            }
            path="terms"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Privacy />
              </Suspense>
            }
            path="privacy"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Guidelines />
              </Suspense>
            }
            path="guidelines"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Copyright />
              </Suspense>
            }
            path="copyright"
          />
          <Route
            element={
              <Suspense fallback={<FullPageLoader />}>
                <Custom404 />
              </Suspense>
            }
            path="*"
          />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
