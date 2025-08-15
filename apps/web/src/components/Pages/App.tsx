import { useMutation, useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { toast } from "sonner";
import { z } from "zod";
import PageLayout from "@/components/Shared/PageLayout";
import { Button, Card, Form, H3, useZodForm } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { hono } from "@/helpers/fetcher";
import { useProModalStore } from "@/store/non-persisted/modal/useProModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface AppEnrollFormValues {
  email: string;
}

const schema = z.object({
  email: z.string().email("Enter a valid email address")
});

const App = () => {
  const { currentAccount } = useAccountStore();
  const { setShow: setShowProModal } = useProModalStore();

  const form = useZodForm<typeof schema>({ schema });

  const { data, refetch } = useQuery({
    queryFn: () => hono.app.getStatus(),
    queryKey: ["app-status"]
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email }: { email: string }) => hono.app.request(email),
    onError: errorToast,
    onSuccess: async () => {
      await refetch();
      toast.success("You're on the list! We'll email you when it's ready.");
    }
  });

  const handleOpenPro = () => setShowProModal(true);

  const handleRequest = async (values: AppEnrollFormValues) => {
    mutate({ email: values.email });
  };

  return (
    <PageLayout title="Mobile App Early Access" zeroTopMargin>
      <div className="mx-auto h-screen rounded-none bg-gradient-to-tr from-cyan-800 via-blue-800 to-indigo-900 p-8 shadow-lg md:h-fit md:rounded-2xl">
        <H3 className="font-bold text-2xl text-white">Join the waitlist</H3>
        <p className="mt-3 text-white/90 leading-relaxed">
          Be the first to try the Hey mobile app. Submit your email and we'll
          notify you as soon as early access is available.
        </p>
        {currentAccount?.hasSubscribed ? (
          data?.requested ? (
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
                    loading={isPending}
                    type="submit"
                  >
                    Request
                  </Button>
                </div>
              </Form>
            </Card>
          )
        ) : null}

        <div className="mt-4 rounded-lg bg-white/10 p-3 text-sm text-white/90">
          Early access is available only for <b>Hey Pro</b> subscribers. If
          you're not subscribed yet, you can get priority access by{" "}
          <button
            className="ml-1 underline hover:text-yellow-200"
            onClick={handleOpenPro}
            type="button"
          >
            subscribing to Pro
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default memo(App);
