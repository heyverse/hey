export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    AccountAction: ["TippingAccountAction", "UnknownAccountAction"],
    AccountActionExecuted: [
      "TippingAccountActionExecuted",
      "UnknownAccountActionExecuted"
    ],
    AccountAvailable: ["AccountManaged", "AccountOwned"],
    AccountFollowOperationValidationOutcome: [
      "AccountFollowOperationValidationFailed",
      "AccountFollowOperationValidationPassed",
      "AccountFollowOperationValidationUnknown"
    ],
    AccountFollowOperationValidationRule: ["AccountFollowRule", "GraphRule"],
    AddAccountManagerResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    AddAdminsResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    AddAppFeedsResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    AddAppGroupsResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    AddAppSignersResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    AddReactionResult: ["AddReactionFailure", "AddReactionResponse"],
    AnyAccountBalance: [
      "Erc20Amount",
      "Erc20BalanceError",
      "NativeAmount",
      "NativeBalanceError"
    ],
    AnyBalance: [
      "Erc20Amount",
      "Erc20BalanceError",
      "NativeAmount",
      "NativeBalanceError"
    ],
    AnyKeyValue: [
      "AddressKeyValue",
      "ArrayKeyValue",
      "BigDecimalKeyValue",
      "BooleanKeyValue",
      "DictionaryKeyValue",
      "IntKeyValue",
      "IntNullableKeyValue",
      "RawKeyValue",
      "StringKeyValue"
    ],
    AnyMedia: ["MediaAudio", "MediaImage", "MediaVideo"],
    AnyPost: ["Post", "Repost"],
    ApproveGroupMembershipResult: [
      "ApproveGroupMembershipRequestsResponse",
      "GroupOperationValidationFailed",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    ArrayData: [
      "AddressKeyValue",
      "BigDecimalKeyValue",
      "BooleanKeyValue",
      "DictionaryKeyValue",
      "IntKeyValue",
      "IntNullableKeyValue",
      "RawKeyValue",
      "StringKeyValue"
    ],
    AssignUsernameToAccountResult: [
      "AssignUsernameResponse",
      "NamespaceOperationValidationFailed",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    AuthenticationResult: [
      "AuthenticationTokens",
      "ExpiredChallengeError",
      "ForbiddenError",
      "WrongSignerError"
    ],
    BanGroupAccountsResult: [
      "BanGroupAccountsResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    BlockResult: [
      "AccountBlockedResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    CanCreateUsernameResult: [
      "NamespaceOperationValidationFailed",
      "NamespaceOperationValidationPassed",
      "NamespaceOperationValidationUnknown",
      "UsernameTaken"
    ],
    CancelGroupMembershipRequestResult: [
      "CancelGroupMembershipRequestResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    ConfigureAccountActionResult: [
      "ConfigureAccountActionResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    ConfigurePostActionResult: [
      "ConfigurePostActionResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    CreateAccountResult: [
      "CreateAccountResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    CreateAccountWithUsernameResult: [
      "CreateAccountResponse",
      "NamespaceOperationValidationFailed",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UsernameTaken"
    ],
    CreateAppResult: [
      "CreateAppResponse",
      "SelfFundedTransactionRequest",
      "TransactionWillFail"
    ],
    CreateFeedResult: [
      "CreateFeedResponse",
      "SelfFundedTransactionRequest",
      "TransactionWillFail"
    ],
    CreateGraphResult: [
      "CreateGraphResponse",
      "SelfFundedTransactionRequest",
      "TransactionWillFail"
    ],
    CreateGroupResult: [
      "CreateGroupResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    CreateSponsorshipResult: [
      "CreateSponsorshipResponse",
      "SelfFundedTransactionRequest",
      "TransactionWillFail"
    ],
    CreateUsernameNamespaceResult: [
      "CreateNamespaceResponse",
      "SelfFundedTransactionRequest",
      "TransactionWillFail"
    ],
    CreateUsernameResult: [
      "CreateUsernameResponse",
      "NamespaceOperationValidationFailed",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UsernameTaken"
    ],
    DeletePostResult: [
      "DeletePostResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    DepositResult: [
      "InsufficientFunds",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    DisableAccountActionResult: [
      "DisableAccountActionResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    DisablePostActionResult: [
      "DisablePostActionResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    EnableAccountActionResult: [
      "EnableAccountActionResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    EnablePostActionResult: [
      "EnablePostActionResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    EnableSignlessResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    ExecuteAccountActionResult: [
      "ExecuteAccountActionResponse",
      "InsufficientFunds",
      "SelfFundedTransactionRequest",
      "SignerErc20ApprovalRequired",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    ExecutePostActionResult: [
      "ExecutePostActionResponse",
      "InsufficientFunds",
      "SelfFundedTransactionRequest",
      "SignerErc20ApprovalRequired",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    FeedOperationValidationOutcome: [
      "FeedOperationValidationFailed",
      "FeedOperationValidationPassed",
      "FeedOperationValidationUnknown"
    ],
    FollowResult: [
      "AccountFollowOperationValidationFailed",
      "FollowResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    GroupOperationValidationOutcome: [
      "GroupOperationValidationFailed",
      "GroupOperationValidationPassed",
      "GroupOperationValidationUnknown"
    ],
    JoinGroupResult: [
      "GroupOperationValidationFailed",
      "JoinGroupResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    LeaveGroupResult: [
      "GroupOperationValidationFailed",
      "LeaveGroupResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    NamespaceOperationValidationOutcome: [
      "NamespaceOperationValidationFailed",
      "NamespaceOperationValidationPassed",
      "NamespaceOperationValidationUnknown"
    ],
    Notification: [
      "AccountActionExecutedNotification",
      "CommentNotification",
      "FollowNotification",
      "GroupMembershipRequestApprovedNotification",
      "GroupMembershipRequestRejectedNotification",
      "MentionNotification",
      "PostActionExecutedNotification",
      "QuoteNotification",
      "ReactionNotification",
      "RepostNotification",
      "TokenDistributedNotification"
    ],
    PausingResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    PayableAmount: ["Erc20Amount", "NativeAmount"],
    PostAction: ["SimpleCollectAction", "UnknownPostAction"],
    PostActionContract: [
      "SimpleCollectActionContract",
      "TippingPostActionContract",
      "UnknownPostActionContract"
    ],
    PostActionExecuted: [
      "SimpleCollectPostActionExecuted",
      "TippingPostActionExecuted",
      "UnknownPostActionExecuted"
    ],
    PostMention: ["AccountMention", "GroupMention"],
    PostMetadata: [
      "ArticleMetadata",
      "AudioMetadata",
      "CheckingInMetadata",
      "EmbedMetadata",
      "EventMetadata",
      "ImageMetadata",
      "LinkMetadata",
      "LivestreamMetadata",
      "MintMetadata",
      "SpaceMetadata",
      "StoryMetadata",
      "TextOnlyMetadata",
      "ThreeDMetadata",
      "TransactionMetadata",
      "UnknownPostMetadata",
      "VideoMetadata"
    ],
    PostOperationValidationOutcome: [
      "PostOperationValidationFailed",
      "PostOperationValidationPassed",
      "PostOperationValidationUnknown"
    ],
    PostOperationValidationRule: ["FeedRule", "PostRule"],
    PostResult: [
      "PostOperationValidationFailed",
      "PostResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    PrepareSignerErc20ApprovalResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    PrimitiveData: [
      "AddressKeyValue",
      "BigDecimalKeyValue",
      "BooleanKeyValue",
      "IntKeyValue",
      "IntNullableKeyValue",
      "RawKeyValue",
      "StringKeyValue"
    ],
    RefreshResult: ["AuthenticationTokens", "ForbiddenError"],
    RejectGroupMembershipResult: [
      "RejectGroupMembershipRequestsResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    RemoveAccountManagerResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    RemoveAdminsResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    RemoveAppFeedsResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    RemoveAppGroupsResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    RemoveAppSignersResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    RemoveGroupMembersResult: [
      "GroupOperationValidationFailed",
      "RemoveGroupMembersResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    RemoveSignlessResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    RequestGroupMembershipResult: [
      "RequestGroupMembershipResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetAccountMetadataResult: [
      "SelfFundedTransactionRequest",
      "SetAccountMetadataResponse",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetAppGraphResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetAppMetadataResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetAppSponsorshipResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetAppTreasuryResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetAppUsernameNamespaceResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetAppVerificationResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetDefaultAppFeedResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetFeedMetadataResult: [
      "SelfFundedTransactionRequest",
      "SetFeedMetadataResponse",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetGraphMetadataResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetGroupMetadataResult: [
      "SelfFundedTransactionRequest",
      "SetGroupMetadataResponse",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetNamespaceMetadataResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SetSponsorshipMetadataResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    SimpleCollectValidationOutcome: [
      "SimpleCollectValidationFailed",
      "SimpleCollectValidationPassed"
    ],
    SwitchAccountResult: ["AuthenticationTokens", "ForbiddenError"],
    TransactionStatusResult: [
      "FailedTransactionStatus",
      "FinishedTransactionStatus",
      "NotIndexedYetStatus",
      "PendingTransactionStatus"
    ],
    TransferPrimitiveOwnershipResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UnassignUsernameToAccountResult: [
      "NamespaceOperationValidationFailed",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UnassignUsernameResponse"
    ],
    UnbanGroupAccountsResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UnbanGroupAccountsResponse"
    ],
    UnblockResult: [
      "AccountUnblockedResponse",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UndoReactionResult: ["UndoReactionFailure", "UndoReactionResponse"],
    UnfollowResult: [
      "AccountFollowOperationValidationFailed",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UnfollowResponse"
    ],
    UnwrapTokensResult: [
      "InsufficientFunds",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UpdateAccountFollowRulesResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UpdateAccountFollowRulesResponse"
    ],
    UpdateAccountManagerResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UpdateFeedRulesResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UpdateFeedRulesResponse"
    ],
    UpdateGraphRulesResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UpdateGroupRulesResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UpdateGroupRulesResponse"
    ],
    UpdateNamespaceRulesResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UpdatePostRulesResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail",
      "UpdatePostRulesResponse"
    ],
    UpdateReservedUsernamesResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UpdateSponsorshipExclusionListResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UpdateSponsorshipLimitsResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    UpdateSponsorshipSignersResult: [
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    WithdrawResult: [
      "InsufficientFunds",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ],
    WrapTokensResult: [
      "InsufficientFunds",
      "SelfFundedTransactionRequest",
      "SponsoredTransactionRequest",
      "TransactionWillFail"
    ]
  }
};
export default result;
