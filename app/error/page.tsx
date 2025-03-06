"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message") || "Something went wrong.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600">Error</h1>
      <p className="text-gray-700 mt-4">{errorMessage}</p>
      <a href="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
        Go Back Home
      </a>
    </div>
  );
}