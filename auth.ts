import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  session: {
    strategy: "database",
  },
  events: {
    async createUser({ user }) {
      await prisma.player.create({
        data: {
          username: user.name ?? user.email!.split("@")[0],
          rubyAmount: 0,
          crystalBallAmount: 100,
          User: {
            connect: { id: user.id },
          },
        },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (!user) return session;

      const player = await prisma.player.findUnique({
        where: { userId: user.id },
      });
      return {
        ...session,
        player: player
          ? {
              id: player.id,
              username: player.username,
              rubyAmount: player.rubyAmount,
              crystalBallAmount: player.crystalBallAmount,
            }
          : undefined,
      };
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated
      return !!auth;
    },
  },
});
