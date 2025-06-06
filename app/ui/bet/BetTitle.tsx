"use server";

type BetTitleProps = {
  name: string;
  closed: boolean;
};

export default async function BetTitle({ name, closed }: BetTitleProps) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="mt-6 text-center text-3xl leading-9 font-extrabold text-red-500">
        {name}{" "}
        <small className="text-sm text-gray-500">
          ({closed ? "Closed" : "Open"})
        </small>
      </h1>
    </div>
  );
}
