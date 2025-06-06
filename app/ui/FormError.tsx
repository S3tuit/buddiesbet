interface FormErrorProps {
  message?: string;
  className?: string;
}

export default function FormError({
  message,
  className = "text-red-800 underline text-sm",
}: FormErrorProps) {
  if (!message) return null;
  return <div className={className}>* {message}</div>;
}
