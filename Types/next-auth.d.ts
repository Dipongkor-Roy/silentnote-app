import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
      id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    }
    interface Session {
      user: {
        id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
      } & DefaultSession["user"];
    }
  }
  //another technique
  declare module "next-auth/jwt" {
    interface JWT {
      sid?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    }
  }