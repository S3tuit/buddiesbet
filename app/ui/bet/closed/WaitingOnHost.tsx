"use client";

import { formatTimeLeftToMinutes } from "@/lib/utils/dateUtils";

type WaitingOnHostProps = {
  timeLeftMs: number;
};

export default function WaitingOnHost({ timeLeftMs }: WaitingOnHostProps) {
  const timeLeftString = formatTimeLeftToMinutes(timeLeftMs);
  return (
    <div className="bg-black-800 p-6 rounded-lg shadow-inner space-y-3">
      <h2 className="text-2xl font-bold text-gold-500 flex items-center gap-2">
        ⏳ Waiting on Host Decision
      </h2>
      <p className="text-foreground">
        The bet is closed, but the host hasn’t chosen the outcome yet.
        <br />
        If nothing happens in {timeLeftString}, voting will open to everyone.
      </p>
    </div>
  );
}
