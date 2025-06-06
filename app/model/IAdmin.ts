import { StakingPosition, StakingPositionDepositStatus } from "@prisma/client";

export type AdminDashboardStats = {
  totalUsers: number;
  activeStakes: number;
  pendingDeposits: number;
  totalStaked: number;
};

type ActivityData = {
  details: string;
};

export type RecentAppActivity = {
  id: string;
  type: string;
  user: string;
  data: ActivityData;
  time: string;
};

export type AppUser = {
  id: string;
  username: string;
  email: string;
  totalStaked: number;
  activePositions: number;
  totalRewards: number;
  joinedAt: string;
};

export type UserStakingPosition = {
  id: string;
  userId: string;
  username: string;
  planName: string;
  network: string;
  amount: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  apr: number;
  rewards: number;
  isActive: boolean;
  depositStatus: StakingPositionDepositStatus;
  lastClaimedAt: string | null;
};

export type UserActivity = {
  id: string;
  type: string;
  data: ActivityData;
  date: string;
  amount: number
};

export type AppUserFullInfo = AppUser & {
  stakingPositions: UserStakingPosition[];
  activities: UserActivity[];
  rewards: {
    id: string;
    amount: number;
    createdAt: string;
  }[];
};
