// app/unauthorized/page.js
export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p>You don't have permission to access the admin area.</p>
      <p>Only sellers can access this section.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">
        Return to Homepage
      </a>
    </div>
  );
}