"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // usePathname and useRouter from 'next/navigation'

const AdminDashboard = () => {
  const pathname = usePathname();
  const navigate = useRouter();

  useEffect(() => {
    if (pathname === "/admin") {
      navigate.push("/admin/overview");
    }
  }, [pathname, navigate]);

  return (<div>
    admin
    </div>)
  ;
};

export default AdminDashboard;
