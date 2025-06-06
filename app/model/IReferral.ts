// Types for referral data
export interface DirectReferral {
  id: string;
  username: string;
  isActive: boolean;
  joinedAt: string;
  totalStaked: number;
  bonusEarned: number;
  referralCount: number;
  downlineBonus: number;
}

export interface DownlineReferral {
  id: string;
  username: string;
  isActive: boolean;
  joinedAt: string;
  totalStaked: number;
  bonusEarned: number;
  referredBy: string;
  referralCount: number;
  downlineBonus: number;
}

export interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalBonus: number;
  directReferrals: DirectReferral[];
  downlineReferrals: DownlineReferral[];
  secondDownlineReferrals: DownlineReferral[];
}

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  totalBonus: number;
}
