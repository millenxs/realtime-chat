"use client";
import { ReactNode } from "react";

import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

const features = [
  {
    name: "Instant messaging.",
    description:
      "Send and receive messages in real time without delays or page reloads. Perfect for support, sales, or real-time collaboration.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "End-to-end encryption.",
    description:
      "All chat data is encrypted using SSL to ensure secure communication and protect your privacy.",
    icon: LockClosedIcon,
  },
  {
    name: "Smart history.",
    description:
      "Access your full conversation history anytime, with keyword search and message pinning for quick reference.",
    icon: ServerIcon,
  },
];

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600">
                Chatbot
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Realtime Chat
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Connect instantly with our intelligent chatbot or real agents.
                Fast, secure, and always available to help you solve problems or
                get things done.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-indigo-600"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="max-w-none rounded-xl sm:w-[57rem] md:-ml-4 lg:-ml-0">
            <AuthCard>
              <LoginForm />
            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  );
}
