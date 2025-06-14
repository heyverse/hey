export const ERRORS = {
  SignWallet: "Please sign in your wallet.",
  SomethingWentWrong: "Something went wrong!"
} as const;

export type ErrorMessage = (typeof ERRORS)[keyof typeof ERRORS];
