import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const MainLayout = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow">
        {user && (
          <p>
            Hello, <b>{user.username}</b>
          </p>
        )}
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-6 items-center">
          <Link
            className="font-medium text-slate-800 hover:text-blue-600"
            to={"/"}
          >
            Home
          </Link>
          <Link
            className="font-medium text-slate-800 hover:text-blue-600"
            to={"/public"}
          >
            Public
          </Link>
          <Link
            className="font-medium text-slate-800 hover:text-blue-600"
            to={"/private"}
          >
            Private
          </Link>
          <Link
            className="font-medium text-slate-800 hover:text-blue-600"
            to={"/login"}
          >
            Login
          </Link>
          <Link
            className="font-medium text-slate-800 hover:text-blue-600"
            to={"/register"}
          >
            Register
          </Link>
          <button
            className="bg-blue-400 rounded-lg p-2 hover:bg-blue-700"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
