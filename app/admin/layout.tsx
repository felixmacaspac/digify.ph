"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { id: "overview", label: "Overview", path: "/admin/overview" },
  { id: "sales", label: "Sales", path: "/admin/sales" },
  { id: "products", label: "Products", path: "/admin/products" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="bg-secondary border">
      <div className="flex border-black border-l max-w-[1440px] mx-auto min-h-screen">
        <aside className="max-w-64 w-full border-r border-r-black pt-10">
          <nav>
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                passHref
                className={`w-full text-left block py-4 px-10 uppercase transition-colors duration-300 ease-in-out ${
                  pathname === item.path
                    ? "bg-purple text-black"
                    : "text-black hover:bg-purple"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="w-full pl-20 mt-10">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
