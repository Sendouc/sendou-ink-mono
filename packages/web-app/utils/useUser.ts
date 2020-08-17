import { useSession } from "next-auth/client";

interface LoggedInUser {
  _id: string;
  discord: {
    id: string;
    avatarUrl?: string;
  };
}

const useUser = (): [LoggedInUser | undefined, boolean] => {
  return useSession();
};

export default useUser;
