export type UserRole = "ADMIN" | "USER";

export type UserProfileResponse = {
  id: string;
  country: string | null;
  dateOfBirth: string | null;
  displayName: string | null;
  email: string | null;
  onboardingCompleted: boolean;
  roles: UserRole[];
};

export type UpdateOnboardingProfileRequest = {
  country: string;
  dateOfBirth: string;
  displayName: string;
};

export type LichessOAuthStartResponse = {
  authorizationUrl: string;
  expiresAt: string;
  state: string;
};

export type CompleteLichessOAuthRequest = {
  code: string;
  state: string;
};

export type LichessAccountResponse = {
  id: string;
  linkedAt: string;
  lichessUserId: string;
  revokedAt: string | null;
  username: string;
};

export type TournamentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "REGISTRATION_CLOSED"
  | "RUNNING"
  | "FINISHED"
  | "CANCELLED";

export type TournamentResponse = {
  id: string;
  name: string;
  description: string | null;
  startsAt: string | null;
  durationMinutes: number | null;
  timeControl: string | null;
  rounds: number | null;
  entryFeeCents: number;
  prizePoolCents: number;
  rules: string | null;
  lichessTournamentId: string | null;
  status: TournamentStatus;
  registrationCount: number;
  cancellationReason: string | null;
  refundStatus: "NONE" | "PENDING";
  createdAt: string;
  updatedAt: string;
};

export type CreateTournamentRequest = {
  name: string;
  description?: string;
  startsAt?: string;
  durationMinutes?: number;
  timeControl?: string;
  rounds?: number;
  entryFeeCents?: number;
  prizePoolCents?: number;
  rules?: string;
  lichessTournamentId?: string;
};

export type UpdateTournamentRequest = Partial<CreateTournamentRequest>;

export type CancelTournamentRequest = {
  reason: string;
};

export type MarketplaceTournamentResponse = Omit<
  TournamentResponse,
  "cancellationReason" | "refundStatus"
>;

export type TournamentPageResponse = {
  items: MarketplaceTournamentResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type WalletEntryType =
  "CREDIT" | "DEBIT" | "RESERVE" | "RELEASE" | "ADJUSTMENT";

export type WalletBalanceResponse = {
  availableBalanceCents: number;
  currency: "USD";
  reservedBalanceCents: number;
};

export type WalletEntryResponse = {
  amountCents: number;
  createdAt: string;
  id: string;
  reason: string | null;
  reference: string | null;
  type: WalletEntryType;
};

export type WalletHistoryPageResponse = {
  items: WalletEntryResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type AdminWalletAdjustmentRequest = {
  amountCents: number;
  idempotencyKey: string;
  reason: string;
  reference?: string;
};

export type AdminWalletAdjustmentResponse = {
  balance: WalletBalanceResponse;
  entry: WalletEntryResponse;
};
