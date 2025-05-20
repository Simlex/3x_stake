import { Network } from "@prisma/client";

export type RequestWithdrawal = {
    amount: number;
    address: string;
    network: Network;
    stakingPositionId?: string
}