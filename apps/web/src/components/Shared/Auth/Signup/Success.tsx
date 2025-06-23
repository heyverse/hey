import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { ERRORS } from "@hey/data/errors";
import { useSwitchAccountMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useEffect } from "react";
import { H4, Image } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { signIn } from "@/store/persisted/useAuthStore";
import { useSignupStore } from ".";

const Success = () => {
  const { accountAddress, onboardingToken } = useSignupStore();

  const onError = (error: ApolloClientError) => {
    errorToast(error);
  };

  const [switchAccount] = useSwitchAccountMutation({ onError });

  const handleAuth = async () => {
    try {
      const auth = await switchAccount({
        context: { headers: { "X-Access-Token": onboardingToken } },
        variables: { request: { account: accountAddress } }
      });

      if (auth.data?.switchAccount.__typename === "AuthenticationTokens") {
        const accessToken = auth.data?.switchAccount.accessToken;
        const refreshToken = auth.data?.switchAccount.refreshToken;
        signIn({ accessToken, refreshToken });
        return location.reload();
      }

      return onError({ message: ERRORS.SomethingWentWrong });
    } catch {
      onError({ message: ERRORS.SomethingWentWrong });
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <H4>Waaa-hey! You got your account!</H4>
      <div className="mt-3 text-center font-semibold text-gray-500 dark:text-gray-200">
        Welcome to decentralised social where everything is sooooooooooooo much
        better! 🎉
      </div>
      <Image
        alt="Dizzy emoji"
        className="mx-auto mt-8 size-14"
        height={56}
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
        width={56}
      />
      <i className="mt-8 text-gray-500 dark:text-gray-200">
        We are taking you to Hey...
      </i>
    </div>
  );
};

export default Success;
