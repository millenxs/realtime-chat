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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setApiError(null);
    try {
      const response = await login(data);
      localStorage.setItem("token", response.data.token);
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro no login";
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
      <div className="flex items-center justify-between">
        <label
          htmlFor="remember"
          className="flex items-center text-sm text-gray-200"
        >
          <Input
            className="form-checkbox h-4 w-4 text-purple-600 bg-gray-800 border-gray-300 rounded"
            type="checkbox"
            id="remember"
            {...register("remember")}
          />
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
        {isSubmitting ? "Entrando..." : "Sign In"}
      </Button>
    </form>
  );
}
