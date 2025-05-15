'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function RegisterForm() {
  return (
    <form method="POST" action="#" className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Name"
          className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
          required
          id="name"
          name="name"
          type="text"
        />
      </div>

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

      <Button
        className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200 cursor-pointer"
        type="submit"
      >
        Sign Up
      </Button>
    </form>
  );
}
