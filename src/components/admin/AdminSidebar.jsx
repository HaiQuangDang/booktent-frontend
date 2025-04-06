import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "📊 Dashboard" },
    { path: "/admin/users", label: "👤 Manage Users" },
    { path: "/admin/stores", label: "🏬 Manage Stores" },
    { path: "/admin/books", label: "📚 Manage Books" },
    { path: "/admin/orders", label: "📦 Manage Orders" },
    { path: "/admin/transactions", label: "💰 Transactions" },
    { path: "/admin/authors", label: "📖 Authors" },
    { path: "/admin/genres", label: "🎭 Genres" },
    { path: "/", label: "🏠 Home" },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md fixed top-0 left-0 flex flex-col">
      <div className="p-6 border-b border-soft-gray">
        <h2 className="text-2xl text-forest font-playfair">Admin Sidebar</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded-md font-inter text-soft-gray transition-colors duration-200 ${
              location.pathname === item.path
                ? "bg-forest text-white"
                : "hover:bg-beige hover:text-forest"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
