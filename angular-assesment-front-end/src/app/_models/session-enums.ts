export enum SessionStatus {
  Unmatched = 0,
  Unverified = 1,
  Verified = 2,
  Active = 3,
  Matched = 4
}

export const SessionStatusLabels = [
  'Unmatched',        // 0
  'Unverified',       // 1
  'Verified',         // 2
  'Active',           // 3
  'Matched'           // 4
];

export enum SessionSource {
  Web = 0,
  Email = 1,
  Phone = 2,
  SocialMedia = 3
}

export const SessionSourceLabels = [
  'Web',              // 0
  'Email',            // 1
  'Phone',            // 2
  'SocialMedia'       // 3
];

export enum SessionMatchMethod {
  NotMatched = 0,
  Email = 1,
  Phone = 2,
  OrderNumber = 3,
  PhoneAndEmail = 4,
  NewOrder = 5
}

export const SessionMatchMethodLabels = [
  'Unmatched',        // 0
  'Email',            // 1
  'Phone',            // 2
  'Order Number',     // 3
  'Phone and Email',  // 4
  'New Order'         // 5
];

export enum SessionResult {
  Unknown = -1,
  Active = 0,
  Timeout = 1,
  Abandoned = 2,
  Complete = 3,
  LifelineTimeout = 4,
  LifelineUndo = 5,
  LifelineExit = 6,
  Error = 7,
  Failed = 8,
  LoggedOut = 9,
  Bypass = 10,
  InvalidToken = 11,
  LifelineError = 12,
  ExpiredToken = 13,
  FrequencyBypass = 14,
  UnmatchedBypass = 15,
  LifelineSearch = 16,
  LifelineNoMatch = 17,
}

export enum SessionType {
  Support = 1,
  Marketplace = 2,
  PaymentUpdate = 3
}

export const SessionTypeLabels = [
  '',                 // 0
  'Support',          // 1
  'Marketplace',      // 2
  'Payment Update'    // 3
]

export const SessionResultLabels = [
  'Active',           // 0
  'Timeout',          // 1
  'Abandoned',        // 2
  'Complete',         // 3
  'Lifeline (Timeout)', // 4
  'Lifeline (Undo)',  // 5
  'Lifeline (Exit)',  // 6
  'Error',            // 7
  'Failed',           // 8
  'Logged Out',       // 9
  'Bypassed',         // 10
  'Invalid Token',    // 11
  'Lifeline (Error)', // 12
  'Expired Token',    // 13
  'Frequency Bypassed', // 14
  'Unmatched Bypassed', // 15
  'Lifeline (Search)', // 16
  'Lifeline (No Match)', // 17
];

export enum LifelineType {
  Phone = 1,
  Email = 2,
  Chat = 3
}

export const LifelineTypeLabels = [
  '',                 // 0
  'Phone',            // 1
  'Email',            // 2
  'Chat'              // 3
];

export enum SessionInputStatus {
  Normal = 0,
  Undone = 1,
  GoneHome = 2,
  NormalSelectNextItem = 3,
  NormalPostSelectNextItem = 4,
  Jump = 5,
  StartLifeline = 6,
  CloseLifeline = 7,
  StartSurvey = 8,
  EnterChildFunnel = 9,
  ExitChildFunnel = 10,
  LifelineContact = 11,
  Error = 12,
  Faqs = 13,
  Product = 14
}

export const SessionInputStatusLabels = [
  'Normal',           // 0
  'Back Button',      // 1
  'Main Menu Button', // 2
  'Next Item',        // 3
  'No More Items',    // 4
  'Path URL Link',    // 5
  'Start Lifeline',   // 6
  'Close Lifeline',   // 7
  'Start Survey',     // 8
  'Enter Path',       // 9
  'Exit Path',        // 10
  'Lifeline Contact', // 11
  'Error',            // 12
  'Faqs',             // 13
  'Product Info'      // 14
];

export enum SessionActionStatus {
  Delayed = 0,
  Executed = 1,
  Cancelled = 2,
  Pending = 3,
  Failed = 4,
  ExecuteAfterDelay = 5,
  CallCenter = 6,
  ThirdParty = 7,
}

export const SessionActionStatusLabels = [
  'Delayed',          // 0
  'Executed',         // 1
  'Cancelled',        // 2
  'Pending',          // 3
  'Failed',           // 4
  'Execute After Delay', //5
  'Handled by Call Center', //6
  'Handled by Third Party', //7
];

export enum SessionActionResult {
  None = 0,
  Cancel = 1,
  RMAReturn = 2,
  RMAExchange = 3,
  Save = 4,
  Revision = 5,
  SubscriptionDownsell = 6,
  Upsell = 7,
  SubscriptionAdjust = 8,
  Downsell = 9,
  SubscriptionCancel = 10,
  SaveNoCount = 11,
  SubscriptionPause = 12,
  NewSale = 13,
  Rebill = 14,
  ReturnExtension = 15,
  SubscriptionRevision = 16,
  SubscriptionReactivate = 17,
}

export const SessionActionResultLabels = [
  'None',
  'Cancel',
  'RMA for Refund',
  'RMA for Exchange',
  'Save',
  'Product Revision',
  'Subscription Downsell',
  'Upsell',
  'Subscription Adjustment',
  'Downsell with Refund',
  'Cancel Subscription',
  'Save (Don\'t Count)',
  'Pause Subscription',
  'New Sale',
  'Rebill',
  'Return Extension',
  'Subscription Revision',
  'Reactivate Subscription',
];

export enum RevenueType {
  None = 0,
  UpSell = 1,
  DownSell = 2,
  PartialCancel = 3,
  VariantChange = 4,
  NewSale = 5,
  Rebill = 6
}

export const RevenueTypeLabels = [
  'None',             // 0
  'UpSell',           // 1
  'DownSell',         // 2
  'Partial Cancel',   // 3
  'Variant Change',   // 4
  'New Sale',         // 5
  'Rebill'            // 6
];

export enum PhoneCallResult {
  Active = 0,
  Timeout = 1,
  Hangup = 2,
  Complete = 3,
  Failed = 4,
  Bypass = 5,
  FrequencyBypass = 6,
  UnmatchedBypass = 7,
}

export const PhoneCallResultLabels = [
  'Active',           // 0
  'Timeout',          // 1
  'Hangup',           // 2
  'Complete',         // 3
  'Failed',           // 4
  'Bypass',           // 5
  'Frequency Bypass', // 6
  'Unmatched Bypass', // 7
];
