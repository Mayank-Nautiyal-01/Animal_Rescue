import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardUser from "./pages/DashboardUser";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardNgo from "./pages/DashboardNgo";
import ReportPage from "./pages/ReportPage";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/report", element: <ReportPage /> },
    { path: "/login/user", element: <LoginPage type="user" /> },
    { path: "/login/ngo", element: <LoginPage type="ngo" /> },
    { path: "/login/admin", element: <LoginPage type="admin" /> },
    { path: "/signup/user", element: <SignupPage type="user" /> },
    { path: "/signup/ngo", element: <SignupPage type="ngo" /> },
    { path: "/dashboard/ngo", element: <DashboardNgo /> },
    { path: "/dashboard/user", element: <DashboardUser /> },
    { path: "/dashboard/admin", element: <DashboardAdmin /> },
]);

export default router;
