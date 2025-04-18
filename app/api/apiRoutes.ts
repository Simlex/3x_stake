/**
 * The API routes endpoints
 */
export class ApiRoutes {
    /**
     * The dev base url for the application
     */
    static BASE_URL_DEV = "http://localhost:5075/api/"
  
    /**
     * The test base url for the application
     */
    static BASE_URL_TEST = "https://3x-stake.vercel.app/"
  
    /**
     * The live base url for the application
     */
    static BASE_URL_LIVE = "https://3x-stake.vercel.app/"
  
    /**
     * The base url being used for the application
     */
    static BASE_URL: string =
      process.env.NODE_ENV === "development"
        ? ApiRoutes.BASE_URL_DEV
        : process.env.NODE_ENV === "test"
          ? ApiRoutes.BASE_URL_TEST
          : ApiRoutes.BASE_URL_LIVE
  
    /**
     * Authentication Routes
     */
    static RequestCredentialToken = "auth/request-token"
    static Login = "auth/login"
    static Signup = "auth/signup"
    static Logout = "auth/logout"
    static ForgotPassword = "auth/forgot-password"
    static ResetPassword = "auth/reset-password"
    static VerifyEmail = "auth/verify-email"
    static RefreshToken = "auth/refresh-token"
    static ValidateSession = "auth/validate-session"
  
    /**
     * User Routes
     */
    static UserProfile = "user/profile"
    static UpdateProfile = "user/profile"
    static ChangePassword = "user/change-password"
    static UserPreferences = "user/preferences"
    static UpdatePreferences = "user/preferences"
  
    /**
     * Admin Routes
     */
    static AdminLogin = "admin/login"
    static AdminUsers = "admin/users"
    static AdminUser = "admin/users/:id"
    static AdminStakingPlans = "admin/staking-plans"
    static AdminStakingPlan = "admin/staking-plans/:id"
    static AdminDashboard = "admin/dashboard"
  
    /**
     * Staking Routes
     */
    static StakingPlans = "staking/plans"
    static StakingPositions = "staking/positions"
    static StakingPosition = "staking/positions/:id"
    static CreateStakingPosition = "staking/positions"
    static Rewards = "staking/rewards"
    static ClaimReward = "staking/rewards/:id/claim"
  
    /**
     * Referral Routes
     */
    static Referrals = "referrals"
    static ReferralStats = "referrals/stats"
  }
  