import { Network, WithdrawalStatus } from "@prisma/client";

export type RequestWithdrawal = {
    amount: number;
    address: string;
    network: Network;
    stakingPositionId?: string
}

type WithdrawalUser = {
    id: string;
    username: string;
}

export type Withdrawal = {
    id: string;
    userId: string;
    amount: number;
    wallet: string;
    network: Network;
    status: WithdrawalStatus;
    createdAt: string;
    updatedAt: string;
    user?: WithdrawalUser;
}