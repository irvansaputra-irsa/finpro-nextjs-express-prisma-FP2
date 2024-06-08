export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 place-content-center h-48 min-h-screen">
      {children}
    </div>
  );
}
