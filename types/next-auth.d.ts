import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    /** Your custom Player payload */
    player?: {
      id: number;
      username: string;
      rubyAmount: number;
      crystalBallAmount: number;
    };
  }
}
