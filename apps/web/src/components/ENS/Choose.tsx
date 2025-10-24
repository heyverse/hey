import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import {
  HEY_ENS_NAMESPACE,
  NATIVE_TOKEN_SYMBOL,
  STATIC_IMAGES_URL
} from "@hey/data/constants";
import { useCreateUsernameMutation, useUsernameQuery } from "@hey/indexer";
import { useCallback, useState } from "react";
import z from "zod";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import errorToast from "@/helpers/errorToast";
import getTokenImage from "@/helpers/getTokenImage";
import useHandleWrongNetwork from "@/hooks/useHandleWrongNetwork";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Tooltip,
  useZodForm
} from "../Shared/UI";
import { useENSCreateStore } from ".";

const ValidationSchema = z.object({
  username: z
    .string()
    .min(1, { message: "ENS name must be at least 1 character long" })
    .max(50, { message: "ENS name must be at most 50 characters long" })
    .regex(/^[A-Za-z]+$/, { message: "ENS name can contain only alphabets" })
});

const Choose = () => {
  const { currentAccount } = useAccountStore();
  const { setChosenUsername, setTransactionHash, setScreen } =
    useENSCreateStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const handleWrongNetwork = useHandleWrongNetwork();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const form = useZodForm({ mode: "onChange", schema: ValidationSchema });

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    setChosenUsername(username);
    setTransactionHash(hash);
    setScreen("minting");
  };

  const onError = useCallback((error?: any) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [createUsername] = useCreateUsernameMutation({
    onCompleted: async ({ createUsername }) => {
      if (createUsername.__typename === "CreateUsernameResponse") {
        return onCompleted(createUsername.hash);
      }

      if (createUsername.__typename === "UsernameTaken") {
        return onError({ message: createUsername.reason });
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: createUsername
      });
    },
    onError
  });

  const username = form.watch("username");
  const canCheck = Boolean(username && username.length > 0);
  const isInvalid = !form.formState.isValid;
  const lengthPriceMap: Record<number, number> = {
    1: 1000,
    2: 500,
    3: 50,
    4: 20
  };

  const len = username?.length || 0;
  const price = len > 4 ? 5 : (lengthPriceMap[len] ?? 0);

  useUsernameQuery({
    fetchPolicy: "no-cache",
    onCompleted: (data) => setIsAvailable(!data.username),
    skip: !canCheck,
    variables: {
      request: {
        username: {
          localName: username?.toLowerCase(),
          namespace: HEY_ENS_NAMESPACE
        }
      }
    }
  });

  const handleCreate = async ({
    username
  }: z.infer<typeof ValidationSchema>) => {
    try {
      setIsSubmitting(true);
      await handleWrongNetwork();

      return await createUsername({
        variables: {
          request: {
            username: {
              localName: username.toLowerCase(),
              namespace: HEY_ENS_NAMESPACE
            }
          }
        }
      });
    } catch {
      onError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = !canCheck || !isAvailable || isSubmitting || isInvalid;

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            alt="Logo"
            className="size-4"
            height={16}
            src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
            width={16}
          />
          <div className="font-black">Heynames</div>
        </div>
        <div className="text-gray-500 text-sm">Powered by ENS</div>
      </div>
      <Form
        className="space-y-5 pt-2"
        form={form}
        onSubmit={async ({ username }) =>
          await handleCreate({ username: username.toLowerCase() })
        }
      >
        <Input
          iconLeft={<MagnifyingGlassIcon />}
          iconRight={<span>hey.xyz</span>}
          placeholder="Search for a name"
          {...form.register("username")}
          hideError
        />
        {canCheck && !isInvalid ? (
          isAvailable === false ? (
            <Card className="p-5">
              <b>{username}.hey.xyz</b> is already taken.
            </Card>
          ) : isAvailable === true ? (
            <Card className="space-y-5 p-5">
              <div>
                Register <b>{username}.hey.xyz</b> for{" "}
                <span className="inline-flex items-center gap-x-1">
                  {price}{" "}
                  <Tooltip content={NATIVE_TOKEN_SYMBOL} placement="top">
                    <img
                      alt={NATIVE_TOKEN_SYMBOL}
                      className="size-5"
                      src={getTokenImage(NATIVE_TOKEN_SYMBOL)}
                    />
                  </Tooltip>
                  / once
                </span>
              </div>
              <Button
                className="w-full"
                disabled={disabled}
                loading={isSubmitting}
                type="submit"
              >
                Register Name
              </Button>
            </Card>
          ) : null
        ) : canCheck && isInvalid ? (
          <Card className="flex items-center space-x-1 p-5 text-red-500 text-sm">
            <ExclamationTriangleIcon className="size-4" />
            <b>{form.formState.errors.username?.message?.toString()}</b>
          </Card>
        ) : null}
      </Form>
    </Card>
  );
};

export default Choose;
