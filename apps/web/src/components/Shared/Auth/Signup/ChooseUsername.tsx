import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import uploadMetadata from "@helpers/uploadMetadata";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  FaceFrownIcon,
  FaceSmileIcon
} from "@heroicons/react/24/outline";
import { APP_NAME, HEY_APP } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import { Regex } from "@hey/data/regex";
import {
  useAccountQuery,
  useAuthenticateMutation,
  useChallengeMutation,
  useCreateAccountWithUsernameMutation
} from "@hey/indexer";
import { Button, Form, Input, useZodForm } from "@hey/ui";
import { account as accountMetadata } from "@lens-protocol/metadata";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccount, useSignMessage } from "wagmi";
import { object, string, type z } from "zod";
import { useSignupStore } from ".";
import AuthMessage from "../AuthMessage";

export const SignupMessage = () => (
  <AuthMessage
    description="Let's start by buying your username for you. Buying you say? Yep - usernames cost a little bit of money to support the network and keep bots away"
    title={`Welcome to ${APP_NAME}!`}
  />
);

const validationSchema = object({
  username: string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(26, { message: "Username must be at most 26 characters long" })
    .regex(Regex.username, {
      message:
        "Username must start with a letter/number, only _ allowed in between"
    })
});

const ChooseUsername: FC = () => {
  const {
    setChoosedHandle,
    setScreen,
    setTransactionHash,
    setOnboardingToken
  } = useSignupStore();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();
  const form = useZodForm({ mode: "onChange", schema: validationSchema });

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const { signMessageAsync } = useSignMessage({ mutation: { onError } });
  const [loadChallenge] = useChallengeMutation();
  const [authenticate] = useAuthenticateMutation();
  const [createAccountWithUsername] = useCreateAccountWithUsernameMutation();

  const username = form.watch("username");

  const canCheck = Boolean(username && username.length > 2);
  const isInvalid = !form.formState.isValid;

  useAccountQuery({
    fetchPolicy: "no-cache",
    onCompleted: (data) => setIsAvailable(!data.account),
    variables: {
      request: { username: { localName: username?.toLowerCase() } }
    }
  });

  const handleSignup = async ({
    username
  }: z.infer<typeof validationSchema>) => {
    try {
      setIsSubmitting(true);
      await handleWrongNetwork();

      const challenge = await loadChallenge({
        variables: {
          request: { onboardingUser: { app: HEY_APP, wallet: address } }
        }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
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
        const accessToken = auth.data?.authenticate.accessToken;
        const metadataUri = await uploadMetadata(
          accountMetadata({ name: username })
        );

        setOnboardingToken(accessToken);
        return await createAccountWithUsername({
          context: { headers: { "X-Access-Token": accessToken } },
          variables: {
            request: {
              username: { localName: username.toLowerCase() },
              metadataUri
            }
          },
          onCompleted: ({ createAccountWithUsername }) => {
            if (
              createAccountWithUsername.__typename === "CreateAccountResponse"
            ) {
              setTransactionHash(createAccountWithUsername.hash);
              setChoosedHandle(username);
              setScreen("minting");
              trackEvent(Events.Account.Signup);
            }
          }
        });
      }
    } catch (error) {
      errorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = !canCheck || !isAvailable || isSubmitting || isInvalid;

  return (
    <div className="space-y-5">
      <SignupMessage />
      <Form
        className="space-y-5 pt-3"
        form={form}
        onSubmit={async ({ username }) =>
          await handleSignup({ username: username.toLowerCase() })
        }
      >
        <div className="mb-5">
          <Input
            hideError
            placeholder="username"
            prefix="@lens/"
            {...form.register("username")}
          />
          {canCheck && !isInvalid ? (
            isAvailable === false ? (
              <div className="mt-2 flex items-center space-x-1 text-red-500 text-sm">
                <FaceFrownIcon className="size-4" />
                <b>Username not available!</b>
              </div>
            ) : isAvailable === true ? (
              <div className="mt-2 flex items-center space-x-1 text-green-500 text-sm">
                <CheckIcon className="size-4" />
                <b>You're in luck - it's available!</b>
              </div>
            ) : null
          ) : canCheck && isInvalid ? (
            <div className="mt-2 flex items-center space-x-1 text-red-500 text-sm">
              <ExclamationTriangleIcon className="size-4" />
              <b>{form.formState.errors.username?.message?.toString()}</b>
            </div>
          ) : (
            <div className="ld-text-gray-500 mt-2 flex items-center space-x-1 text-sm">
              <FaceSmileIcon className="size-4" />
              <b>Hope you will get a good one!</b>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button className="w-full" disabled={disabled} type="submit">
            Signup
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChooseUsername;
