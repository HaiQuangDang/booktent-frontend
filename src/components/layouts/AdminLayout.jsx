import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";

const AdminLayout = () => (
  <div className="flex">
    <AdminSidebar />
    <main className="flex-1 ml-64 p-8">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
