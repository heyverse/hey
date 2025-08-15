import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import PageLayout from "@/components/Shared/PageLayout";
import { Button, Card, Form, H3, useZodForm } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { hono } from "@/helpers/fetcher";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useProModalStore } from "@/store/non-persisted/modal/useProModalStore";
import { hydrateAuthTokens } from "@/store/persisted/useAuthStore";

interface AppEnrollFormValues {
  email: string;
}

const schema = z.object({
  email: z.string().email("Enter a valid email address")
});

const App = () => {
  const { accessToken } = hydrateAuthTokens();
  const isAuthenticated = Boolean(accessToken);

  const { setShowAuthModal } = useAuthModalStore();
  const { setShow: setShowProModal } = useProModalStore();
  const [hasRequested, setHasRequested] = useState(false);

  const form = useZodForm<typeof schema>({ schema });

  useEffect(() => {
    if (!isAuthenticated) return;
    hono.app
      .getStatus()
      .then((status) => {
        setHasRequested(Boolean(status?.requested));
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleOpenLogin = () => setShowAuthModal(true, "login");
  const handleOpenPro = () => setShowProModal(true);

  const handleRequest = async (values: AppEnrollFormValues) => {
    if (!isAuthenticated) {
      handleOpenLogin();
      return;
    }

    try {
      const res = await hono.app.request(values.email);
      setHasRequested(res.requested);
      toast.success("You're on the list! We'll email you when it's ready.");
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes("401")) {
        handleOpenPro();
        return;
      }
      if (message.includes("Email already requested")) {
        setHasRequested(true);
        toast.success("You're already on the list.");
        return;
      }

      errorToast(err);
    }
  };

  return (
    <PageLayout title="Mobile App Early Access">
      <div className="mx-auto rounded-2xl bg-gradient-to-tr from-cyan-800 via-blue-800 to-indigo-900 p-8 shadow-lg">
        <H3 className="font-bold text-2xl text-white">Join the waitlist</H3>
        <p className="mt-3 text-white/90 leading-relaxed">
          Be the first to try the Hey mobile app. Submit your email and we'll
          notify you as soon as early access is available.
        </p>
        {hasRequested ? (
          <div className="mt-5 rounded-lg bg-white/10 px-5 py-3 text-center font-medium text-white">
            You're on the list ✅
          </div>
        ) : (
          <Card
            className="mt-5 overflow-hidden border-none p-0 shadow-sm"
            forceRounded
          >
            <Form<AppEnrollFormValues> form={form} onSubmit={handleRequest}>
              <div className="flex flex-col sm:flex-row">
                <input
                  aria-label="Email address"
                  className="flex-1 rounded-none border-0 px-4 py-3 focus:ring-0 sm:rounded-l-xl"
                  placeholder="you@example.com"
                  type="email"
                  {...form.register("email")}
                />
                <Button
                  aria-label="Request early access"
                  className="rounded-none px-6 sm:rounded-r-xl"
                  loading={form.formState.isSubmitting}
                  type="submit"
                >
                  Request
                </Button>
              </div>
            </Form>
          </Card>
        )}

        {/* Note */}
        <div className="mt-4 rounded-lg bg-white/10 p-3 text-sm text-white/90">
          Early access is available only for{" "}
          <span className="font-semibold">Hey Pro</span> subscribers. If you're
          not subscribed yet, you can get priority access.
          <button
            className="ml-1 underline hover:text-yellow-200"
            onClick={handleOpenPro}
            type="button"
          >
            Subscribe to Pro
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default memo(App);
