import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import api from "../api/axios";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    if (!isLogin && !name) {
      alert("Please enter your name");
      return;
    }

    try {
      if (isLogin) {
        const response = await api.post("/user/login", {
          email,
          password,
        });

        const token = response.data.token;

        localStorage.setItem("token", token);

        onLogin(token);
      } else {
        await api.post("/user", {
          name,
          email,
          password,
        });

        alert("Registration successful! Please login.");

        setIsLogin(true);
        setName("");
        setPassword("");
      }
    } catch (error) {
      console.error("Authentication failed:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isLogin
              ? "Login to manage your tasks"
              : "Create an account to get started"}
          </p>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          )}

          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>

          <Button
            variant="link"
            className="mt-1 text-blue-600"
            onClick={() => {
              setIsLogin(!isLogin);
              setName("");
              setEmail("");
              setPassword("");
            }}
          >
            {isLogin
              ? "Create an account"
              : "Login instead"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Auth;