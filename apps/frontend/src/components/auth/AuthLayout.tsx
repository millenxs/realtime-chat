import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from '@heroicons/react/20/solid';
import { ReactNode } from 'react';

const features = [
  {
    name: 'Instant messaging.',
    description:
      'Send and receive messages in real time without delays or page reloads.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'End-to-end encryption.',
    description:
      'All chat data is encrypted using SSL to ensure secure communication.',
    icon: LockClosedIcon,
  },
  {
    name: 'Smart history.',
    description:
      'Access your full conversation history with keyword search and pinning.',
    icon: ServerIcon,
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold text-indigo-600">
                Chatbot
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Realtime Chat
              </p>
              <p className="mt-6 text-lg text-gray-600">
                Connect instantly with our intelligent chatbot or real agents.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base text-gray-600">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-indigo-600"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
