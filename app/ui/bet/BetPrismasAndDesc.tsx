type BetPrismasAndDescProps = {
  totalBetted: number;
  description: string | null;
};

export default async function BetPrismasAndDesc({
  totalBetted,
  description,
}: BetPrismasAndDescProps) {
  return (
    <>
      {/* Total prismas */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl animate-pulse">🔴</span>
        <span className="inline-block px-6 py-3 bg-red-200 rounded-full shadow-lg">
          <span className="text-xl font-extrabold text-red-600">
            {totalBetted}
          </span>
        </span>
        <span className="text-l font-semibold uppercase text-white tracking-wide">
          prismas placed
        </span>
      </div>

      {/* Description */}
      <section className="border-1 my-4 mb-4 border-gray-500">
        <p className="text-l text-gray-300 italic max-w-prose">
          {description ||
            "(No description provided. Maybe the mystery is part of the fun...)"}
        </p>
      </section>
    </>
  );
}
