import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { hono } from "@/helpers/fetcher";

type PageviewTrackerProps = Record<string, never>;

const PageviewTracker = (_props: PageviewTrackerProps) => {
  const { pathname } = useLocation();

  const { mutate: handleSendPageview } = useMutation({
    mutationFn: (path: string) => hono.pageview.create(path),
    mutationKey: ["pageview"],
    onError: () => {}
  });

  useEffect(() => {
    handleSendPageview(pathname);
  }, []);

  return null;
};

export default PageviewTracker;
