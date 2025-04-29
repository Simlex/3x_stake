// Core models for the application

// User model
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  referralCode?: string;
  referredBy?: string;
}

// Staking position model
export interface StakingPosition {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  network: Network;
  startDate: string;
  endDate?: string;
  lastClaimedAt?: string;
  nextClaimDeadline?: string;
  apr: number;
  rewards: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Staking plan model
export interface StakingPlan {
  id: string;
  name: string;
  tier: string;
  minAmount: number;
  maxAmount: number;
  apr: number;
  aprMax: number;
  features: string[];
  popular: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Reward model
export interface Reward {
  id: string;
  userId: string;
  stakingPositionId: string;
  stakingPosition?: Partial<StakingPosition>
  amount: number;
  status: RewardStatus;
  claimedAt?: string;
  createdAt: string;
}

// Activity model
export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  amount: number;
  date: string;
  details: string;
  relatedId?: string;
  createdAt: string;
}

// User preferences model
export interface UserPreference {
  id: string;
  userId: string;
  theme: Theme;
  emailNotifications: boolean;
  stakingUpdates: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

// User profile summary
export interface UserProfileSummary {
  totalStaked: number;
  activePositions: number;
  totalRewards: number;
  referrals: number;
  referralCode: string;
  recentActivity: Activity[];
}

// Enums
export enum Network {
  SOL = "SOL",
  TRX = "TRX",
  BEP20 = "BEP20",
  TON = "TON",
}

export enum RewardStatus {
  PENDING = "PENDING",
  CLAIMED = "CLAIMED",
  FAILED = "FAILED",
}

export enum ActivityType {
  STAKE = "STAKE",
  UNSTAKE = "UNSTAKE",
  REWARD = "REWARD",
  REFERRAL = "REFERRAL",
  LOGIN = "LOGIN",
  SIGNUP = "SIGNUP",
}

export enum Theme {
  LIGHT = "LIGHT",
  DARK = "DARK",
  SYSTEM = "SYSTEM",
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
