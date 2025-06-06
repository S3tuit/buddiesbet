// app/page.tsx
"use server";
import { auth } from "@/auth"; // the export from auth.ts
import LoginButtons from "./client";

export default async function HomePage() {
  const session = await auth();
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Current Session</h1>
      <pre className="bg-black-800 p-4 rounded">
        {JSON.stringify(session, null, 2)}
      </pre>
      <LoginButtons />
    </main>
  );
}
