import { Network } from "@prisma/client";

export type DepositAddress = {
    id: string;
    network: Network;
    address: string;
    createdAt: Date;
}