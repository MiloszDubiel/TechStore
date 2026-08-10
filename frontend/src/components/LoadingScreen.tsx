const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--background) text-(--foreground)">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--border) border-t-(--primary)" />

        <p className="text-xl font-semibold">Ładowanie...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
