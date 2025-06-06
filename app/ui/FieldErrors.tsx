export interface FieldErrorsProps {
  errors?: Record<string, string[]>;
  field: string;
  className?: string;
}

export default function FieldErrors({
  errors,
  field,
  className = "text-red-800 underline text-sm",
}: FieldErrorsProps) {
  const fieldErrs = errors?.[field];
  if (!fieldErrs?.length) return null;

  return (
    <div className={className}>
      {fieldErrs.map((errMsg, i) => (
        <div key={i}>* {errMsg}</div>
      ))}
    </div>
  );
}
