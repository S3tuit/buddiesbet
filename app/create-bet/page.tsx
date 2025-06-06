"use client";

import { useCallback } from "react";
import CreateBetForm from "@/app/ui/create-bet/createBetForm";
import { useRouter } from "next/navigation";

export default function CreateBetPage() {
  const router = useRouter();

  const onSuccessCreateBet = useCallback(
    (betId: number) => {
      router.push(`/bet/${betId}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-black-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-red-500">
          CREATE BET
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CreateBetForm onSuccessCreateBet={onSuccessCreateBet} />
        </div>
      </div>
    </div>
  );
}
