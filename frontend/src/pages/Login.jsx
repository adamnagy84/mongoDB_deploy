import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      toast.success("Logged in successfully.");
      await sleep(1000);
      navigate("/private");
    } catch (error) {
      setError(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
      <p className="text-slate-600 mt-1">
        Cookie-based JWT auth (credentials included)
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="test@test.com"
            autoComplete="email"
          />
        </div>
        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="******"
            autoComplete="new-password"
          />
        </div>

        <button
          className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        No account yet?{" "}
        <Link to={"/register"} className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
