export function Loading({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-2 animate-fade-in">
      <div
        aria-label="loading"
        className="w-6 h-6 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"
        role="status"
      />
      <p className="text-lg text-rose-600">{message}</p>
    </div>
  );
}
