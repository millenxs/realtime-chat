"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function LoginForm() {
  return (
      <form method="POST" action="#" className="space-y-6">
        <div className="relative">
          <Input
            placeholder="Email"
            className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
            required
            id="email"
            name="email"
            type="email"
          />
        </div>
        <div className="relative">
          <Input
            placeholder="Password"
            className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
            required
            id="password"
            name="password"
            type="password"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-200">
            <Input
              className="form-checkbox h-4 w-4 text-purple-600 bg-gray-800 border-gray-300 rounded"
              type="checkbox"
            />
            <span className="ml-2">Remember me</span>
          </label>
        </div>
        <Button
          className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200 cursor-pointer"
          type="submit"
        >
          Sign In
        </Button>
      </form>
  );
}
