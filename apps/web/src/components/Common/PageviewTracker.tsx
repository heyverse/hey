import { HEY_API_URL } from "@hey/data/constants";
import { useEffect } from "react";
import { useLocation } from "react-router";

type PageviewTrackerProps = Record<string, never>;

const PageviewTracker = (_props: PageviewTrackerProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const body = JSON.stringify({ path: pathname });
    const endpoint = `${HEY_API_URL}/pageview`;

    const handleSendPageview = () => {
      try {
        fetch(endpoint, {
          body,
          headers: { "Content-Type": "application/json" },
          method: "POST"
        }).catch(() => {});
      } catch {}
    };

    handleSendPageview();
  }, [pathname]);

  return null;
};

export default PageviewTracker;
