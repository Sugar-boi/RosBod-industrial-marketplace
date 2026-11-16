export default function OfflinePage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f7f7f5] px-6 text-center">
      <h1 className="text-2xl font-extrabold text-[#24272b]">
        You&apos;re offline
      </h1>
      <p className="mt-3 max-w-md text-sm text-gray-500">
        Check your connection and try again. Some pages may still open from
        cache.
      </p>
      <a
        href="/"
        className="mt-6 rounded-xl bg-[#ff9900] px-5 py-3 text-sm font-extrabold text-[#24272b]"
      >
        Go home
      </a>
    </main>
  );
}