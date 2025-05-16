"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { registerSchema, register } from "@/services/auth";

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register: registerInput,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setApiError(null);
    try {
      await register(data);
      toast.success("Cadastro realizado com sucesso! Faça login.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Erro no cadastro";
      setApiError(message);
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="relative">
        <Input
          placeholder="Name"
          className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
          {...registerInput("name")}
          type="text"
          id="name"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p
            id="name-error"
            role="alert"
            className="text-red-500 text-sm mt-1"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          placeholder="Email"
          className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
          {...registerInput("email")}
          type="email"
          id="email"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="text-red-500 text-sm mt-1"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          placeholder="Password"
          className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
          {...registerInput("password")}
          type="password"
          id="password"
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-red-500 text-sm mt-1"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          placeholder="Confirm Password"
          className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
          {...registerInput("confirmPassword")}
          type="password"
          id="confirmPassword"
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
        />
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            role="alert"
            className="text-red-500 text-sm mt-1"
          >
            {errors.confirmPassword.message}
          </p>
        )}
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
        {isSubmitting ? "Cadastrando..." : "Sign Up"}
      </Button>
    </form>
  );
}
