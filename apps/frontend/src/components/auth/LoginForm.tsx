"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { loginSchema, login } from "@/services/auth";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize form with validation using zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Function triggered on form submit
  async function onSubmit(data: LoginFormData) {
    setApiError(null);
    try {
      const { email, password } = data;
      const response = await login({ email, password });

      // Save token in localStorage
      localStorage.setItem("token", response.data.token);

      toast.success("Successfully signed in!");
      setTimeout(() => {
        router.push("/home"); // Redirect to home after successful login
      }, 1500);
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      setApiError(message);
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="relative">
        <Input
          placeholder="Email"
          className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
          {...register("email")}
          type="email"
          id="email"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p role="alert" className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          placeholder="Password"
          className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
          {...register("password")}
          type="password"
          id="password"
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <p role="alert" className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember me - optional feature */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="remember"
          className="flex items-center text-sm text-gray-200"
        >
          <span className="ml-2">Remember me</span>
        </label>
      </div>

      {apiError && (
        <p className="text-red-500 text-center text-sm mb-2" role="alert">
          {apiError}
        </p>
      )}

      <Button
        className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200 cursor-pointer"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
