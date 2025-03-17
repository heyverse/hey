import regexLookbehindAvailable from "./utils/regexLookbehindAvailable";

const RESTRICTED_SYMBOLS = "☑️✓✔✅";

// We only want to match mention when the `@` character is at the start of the
// line or right after a whilespace.
const MATCH_BEHIND = regexLookbehindAvailable ? "(?<=^|\\s)" : "";

const MENTION_NAMESPACE = "\\w+\\/";
const MENTION_BODY = "([\\dA-Za-z]\\w{2,25})";
const EDITOR_MENTION = "([\\dA-Za-z]\\w*)"; // This will start searching for mentions after the first character

export const Regex = {
  evmAddress: /^(0x)?[\da-f]{40}$/i,
  username: /^[\dA-Za-z]\w{2,25}$/g,
  hashtag: /(#\w*[A-Za-z]\w*)/g,
  // Match string like @lens/someone.
  mention: new RegExp(
    `${MATCH_BEHIND}@${MENTION_NAMESPACE}${MENTION_BODY}`,
    "g"
  ),
  // Match string like @someone.
  accountNameFilter: new RegExp(`[${RESTRICTED_SYMBOLS}]`, "gu"),
  accountNameValidator: new RegExp(`^[^${RESTRICTED_SYMBOLS}]+$`),
  txHash: /^0x[\dA-Fa-f]{64}$/,
  // modified version of https://stackoverflow.com/a/6041965/961254 to support unicode international characters
  url: /\b(http|https):\/\/([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+))([\p{L}\p{N}_.,@?^=%&:\/~+#-]*[\p{L}\p{N}_@?^=%&\/~+#-])/gu
};

export const EditorRegex = {
  emoji: new RegExp(`${MATCH_BEHIND}:\\w*$`, "g"),
  mention: new RegExp(`${MATCH_BEHIND}@${EDITOR_MENTION}$`, "g")
};
