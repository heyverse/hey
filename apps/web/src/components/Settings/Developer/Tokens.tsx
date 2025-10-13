import { ERRORS } from "@hey/data/errors";
import { useAuthenticateMutation, useChallengeMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount, useSignMessage } from "wagmi";
import BackButton from "@/components/Shared/BackButton";
import { Button, Card, CardHeader, H6 } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import logEvent from "@/helpers/logEvent";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import useHandleWrongNetwork from "@/hooks/useHandleWrongNetwork";
import { hydrateAuthTokens } from "@/store/persisted/useAuthStore";

const Tokens = () => {
  const { accessToken, refreshToken } = hydrateAuthTokens();
  const [builderToken, setBuilderToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyAccessToken = useCopyToClipboard(
    accessToken as string,
    "Copied to clipboard"
  );
  const copyRefreshToken = useCopyToClipboard(
    refreshToken as string,
    "Copied to clipboard"
  );
  const copyBuilderToken = useCopyToClipboard(
    builderToken ?? "",
    "Copied to clipboard"
  );

  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const { signMessageAsync } = useSignMessage({
    mutation: {
      onError,
      onSuccess: () => void logEvent("Viem: Token Sign Message")
    }
  });
  const [loadChallenge] = useChallengeMutation();
  const [authenticate] = useAuthenticateMutation();

  const handleGenerateBuilderToken = async () => {
    try {
      setIsSubmitting(true);
      await handleWrongNetwork();

      const challenge = await loadChallenge({
        variables: { request: { builder: { address } } }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(ERRORS.SomethingWentWrong);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth account
      const auth = await authenticate({
        variables: { request: { id: challenge.data.challenge.id, signature } }
      });

      if (auth.data?.authenticate.__typename === "AuthenticationTokens") {
        setBuilderToken(auth.data?.authenticate.accessToken);
      }
    } catch (error) {
      errorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader
        icon={<BackButton path="/settings" />}
        title="Your temporary access token"
      />
      <div className="m-5 space-y-5">
        <div className="flex flex-col gap-y-3">
          <b>Your temporary access token</b>
          <button
            className="cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
            onClick={copyAccessToken}
            type="button"
          >
            <H6>{accessToken}</H6>
          </button>
        </div>
        <div className="flex flex-col gap-y-3">
          <b>Your temporary refresh token</b>
          <button
            className="cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
            onClick={copyRefreshToken}
            type="button"
          >
            <H6>{refreshToken}</H6>
          </button>
        </div>
        <div className="flex flex-col gap-y-3">
          <b>Your temporary builder token</b>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={handleGenerateBuilderToken}
          >
            Generate builder token
          </Button>
          {builderToken && (
            <button
              className="mt-5 cursor-pointer break-all rounded-md bg-gray-300 p-2 px-3 text-left dark:bg-gray-600"
              onClick={copyBuilderToken}
              type="button"
            >
              <H6>{builderToken}</H6>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Tokens;
