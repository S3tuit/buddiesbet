"use client";
import { signIn, signOut } from "next-auth/react";

export default function LoginButtons() {
  return (
    <>
      <button
        className="border-4 border-white outline-white"
        onClick={() => signIn("github")}
      >
        Sign in with GitHub
      </button>
      <button
        className="border-4 border-white outline-white"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </>
  );
}
