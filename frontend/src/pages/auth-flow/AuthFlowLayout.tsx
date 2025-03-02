import { Outlet } from "react-router";

export function AuthFlowLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}
