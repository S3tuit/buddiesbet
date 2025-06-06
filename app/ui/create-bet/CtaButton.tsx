type CtaButtonProps = {
  label: string;
  isSubmit?: boolean;
  onClicked?: () => void;
  showGoBack?: boolean;
  onGoBack?: () => void;
};

export default function CtaButton({
  label,
  isSubmit = false,
  onClicked,
  showGoBack = false,
  onGoBack,
}: CtaButtonProps) {
  const primaryBtn = (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={!isSubmit ? onClicked : undefined}
      className="flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:border-gold-600 focus:shadow-outline-gold active:bg-gold-700 transition duration-150 ease-in-out"
    >
      {label}
    </button>
  );

  if (!showGoBack) {
    return <div className="flex">{primaryBtn}</div>;
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onGoBack}
        className="flex-1 flex justify-center py-2 px-4 border border-gold-500 text-sm font-medium rounded-md text-gold-500 bg-transparent hover:border-gold-600 hover:text-gold-600 transition duration-150 ease-in-out"
      >
        Go Back
      </button>
      {primaryBtn}
    </div>
  );
}
