import { Outlet } from "react-router";
// import { useRefreshToken } from "../../api/auth";
import { useAccessToken } from "../../AuthContext";
import { DashboardLayout } from "../../components/DashboardLayout";

export function ProtectedRoutes() {
  // const getAccessToken = useRefreshToken();
  const accessToken = useAccessToken();

  // useEffectOnce(() => {
  //   // Request `accessToken` when protected routes directly opened.
  //   // When navigated from Login or Register pages, `accessToken` will already exist.
  //   if (!accessToken) getAccessToken();
  // });

  if (!accessToken)
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl animate-pulse">Loading...</h1>
      </div>
    );

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
