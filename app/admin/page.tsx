"use client";
import React, { useState } from "react";
import CameraBrandsChart from "@/components/camera-brands-chart";
import UserGrowthChart from "@/components/users-chart";

const sidebarItems = [
  {
    id: "sales",
    label: "Sales",
    path: "/sales",
  },
  {
    id: "customers",
    label: "Customers",
    path: "/customers",
  },
  {
    id: "products",
    label: "Products",
    path: "/products",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
  },
];

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("sales");

  return (
    <div className="flex text-white mt-20 gap-8">
      <div className="w-64 bg-black rounded-3xl">
        <div className="p-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full px-6 py-3 text-left transition-colors
                ${
                  activeItem === item.id
                    ? "bg-blue text-white"
                    : "text-white hover:bg-blue/50"
                }`}
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-8 bg-black rounded-3xl grid gap-4">
        <CameraBrandsChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
