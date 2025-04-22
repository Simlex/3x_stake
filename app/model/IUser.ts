// Define the user type
export type User = {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  isAdmin?: boolean
  profileImage?: string | null;
};
