"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const sidebarItems = [
  { id: "overview", label: "Overview", path: "/admin/overview" },
  { id: "sales", label: "Sales", path: "/admin/sales" },
  { id: "products", label: "Products", path: "/admin/products" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("customers")
        .select("role")
        .eq("customer_id", user.id)
        .single();


      if (error) {
        console.error("Error fetching role:", error);
        router.push("/");
        return;
      }

      setRole(data?.role || null);

    }

    fetchRole();
  }, [router]);

  useEffect(() => {
    if (role !== 1) {
      router.push("/"); // ✅ Redirect if user is not an admin
    }
  }, [role, router]);


  return (
    <div className="bg-white">
      <div className="flex border-black border-l max-w-[1440px] mx-auto min-h-screen">
        <aside className="max-w-64 w-full border-r border-r-black pt-10">
          <nav>
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
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
