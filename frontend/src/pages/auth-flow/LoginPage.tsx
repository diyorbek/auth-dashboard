import ky, { HTTPError } from "ky";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router";
import { useSetAccessToken } from "../../AuthContext";
import {
  API_BASE,
  LoginRequestBody,
  LoginResponse,
} from "../../data/httpClient";

export function LoginPage() {
  const setAccessToken = useSetAccessToken();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginRequest = useMutation({
    mutationKey: ["login"],
    mutationFn: (body: LoginRequestBody) =>
      ky
        .post<LoginResponse>(`${API_BASE}/login`, {
          json: body,
          credentials: "include",
        })
        .json(),
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { accessToken } = await loginRequest.mutateAsync(formData);
      setAccessToken(accessToken);
      navigate("/");
    } catch (error) {
      const httpError = error as HTTPError;
      const response = await httpError?.response.json();
      console.error(error);
      console.error(JSON.stringify(response));
      alert(JSON.stringify(response));
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-gray-600">
          Or{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            create a new account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </button>
      </form>
    </>
  );
}
