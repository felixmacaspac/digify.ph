export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 bg-purple min-h-screen relative">
      {children}
    </div>
  );
}
