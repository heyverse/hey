import { ERRORS } from "@hey/data/errors";
import {
  type ChallengeRequest,
  ManagedAccountsVisibility,
  useAccountsAvailableQuery,
  useAuthenticateMutation,
  useChallengeMutation
} from "@hey/indexer";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { signIn } from "@/store/persisted/useAuthStore";

const LoginScreen = () => {
  const router = useRouter();
  const [privateKey, setPrivateKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggingInAccountId, setLoggingInAccountId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onError = useCallback((error?: any) => {
    setIsSubmitting(false);
    setLoggingInAccountId(null);
    const message = (error as any)?.message || ERRORS.SomethingWentWrong;
    setErrorMessage(message);
  }, []);

  const derivedAccount = useMemo(() => {
    try {
      const normalized = privateKey?.trim();
      if (!normalized) return null;
      const prefixed = normalized.startsWith("0x")
        ? (normalized as Hex)
        : (`0x${normalized}` as Hex);
      return privateKeyToAccount(prefixed);
    } catch {
      return null;
    }
  }, [privateKey]);

  const ownerAddress = derivedAccount?.address;

  const [loadChallenge] = useChallengeMutation({ onError });
  const [authenticate] = useAuthenticateMutation({ onError });

  const { data, loading } = useAccountsAvailableQuery({
    skip: !ownerAddress,
    variables: {
      accountsAvailableRequest: {
        hiddenFilter: ManagedAccountsVisibility.NoneHidden,
        managedBy: ownerAddress ?? undefined
      },
      lastLoggedInAccountRequest: { address: ownerAddress ?? "" }
    }
  });

  const allItems = data?.accountsAvailable.items || [];
  const lastLogin = data?.lastLoggedInAccount;
  const remainingAccounts = lastLogin
    ? allItems
        .filter(({ account }) => account.address !== lastLogin.address)
        .map(({ account }) => account)
    : allItems.map(({ account }) => account);

  const accounts = lastLogin
    ? [lastLogin, ...remainingAccounts]
    : remainingAccounts;

  const handleChangePrivateKey = (text: string) => {
    setErrorMessage(null);
    setPrivateKey(text);
  };

  const handleSignIn = async (accountAddress: string) => {
    if (!derivedAccount || !ownerAddress) {
      setErrorMessage("Enter a valid private key first");
      return;
    }

    const isManager = allItems.some(
      ({ account: a, __typename }) =>
        __typename === "AccountManaged" && a.address === accountAddress
    );

    const meta = { account: accountAddress };
    const request: ChallengeRequest = isManager
      ? { accountManager: { manager: ownerAddress, ...meta } }
      : { accountOwner: { owner: ownerAddress, ...meta } };

    try {
      setLoggingInAccountId(accountAddress);
      setIsSubmitting(true);

      const challenge = await loadChallenge({ variables: { request } });
      const challengeText = challenge?.data?.challenge?.text;
      const challengeId = challenge?.data?.challenge?.id;

      if (!challengeText || !challengeId) {
        onError({ message: ERRORS.SomethingWentWrong });
        return;
      }

      const signature = await derivedAccount.signMessage({
        message: challengeText
      });

      const auth = await authenticate({
        variables: { request: { id: challengeId, signature } }
      });

      if (auth.data?.authenticate.__typename === "AuthenticationTokens") {
        const accessToken = auth.data?.authenticate.accessToken;
        const refreshToken = auth.data?.authenticate.refreshToken;
        signIn({ accessToken, refreshToken });
        router.replace("/(protected)");
        return;
      }

      onError({ message: ERRORS.SomethingWentWrong });
    } catch (e) {
      onError(e);
    }
  };

  return (
    <View>
      <Text>Private Key Login</Text>

      <View>
        <Text>Enter Ethereum Private Key</Text>
        <TextInput
          accessibilityLabel="Private key input"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={handleChangePrivateKey}
          placeholder="0x..."
          secureTextEntry
          value={privateKey}
        />
        {ownerAddress ? (
          <Text>Derived address: {ownerAddress}</Text>
        ) : privateKey ? (
          <Text>Invalid private key</Text>
        ) : null}
      </View>

      {errorMessage ? <Text>{errorMessage}</Text> : null}

      {ownerAddress ? (
        loading ? (
          <View>
            <ActivityIndicator />
          </View>
        ) : accounts.length > 0 ? (
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.address}
            renderItem={({ item }) => (
              <View>
                <View>
                  <Text>{item.username?.localName || item.address}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`Login to ${item.address}`}
                  onPress={() => handleSignIn(item.address)}
                >
                  {isSubmitting && loggingInAccountId === item.address ? (
                    <ActivityIndicator />
                  ) : (
                    <Text>Login</Text>
                  )}
                </Pressable>
              </View>
            )}
          />
        ) : (
          <Text>No accounts found for this address.</Text>
        )
      ) : null}
    </View>
  );
};

export default LoginScreen;
