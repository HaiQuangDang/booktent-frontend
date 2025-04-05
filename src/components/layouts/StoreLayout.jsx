import React from 'react';
import { Outlet } from 'react-router-dom';
import StoreSidebar from '../stores/StoreSidebar';

const StoreLayout = () => (
  <div className="flex">
    <StoreSidebar />
    <main className="flex-1 ml-64 p-8">
      <Outlet />
    </main>
  </div>
);

export default StoreLayout;