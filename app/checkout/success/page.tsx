"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-bounce mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Successfully Placed!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. We have sent the order confirmation to
          your email.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-600 mb-2">Order number</div>
          <div className="text-lg font-semibold">#ORD-2024-1234</div>
        </div>

        <div className="space-y-4">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4 text- uppercase font-bold"
          >
            View Order
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessPage;
