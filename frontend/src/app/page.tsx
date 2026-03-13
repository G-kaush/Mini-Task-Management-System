'use client';

import Link from 'next/link';
import { useAuth } from '@/context';
import { Button } from '@/components';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Manage Your Tasks</span>
          <span className="block text-blue-600">Efficiently</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A simple and powerful task management system. Create, organize, and track your tasks with ease.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          {isAuthenticated ? (
            <Link href="/tasks">
              <Button size="lg">Go to Tasks</Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900">Create Tasks</h3>
            <p className="mt-2 text-gray-600">
              Easily create and organize tasks with titles, descriptions, priorities, and due dates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900">Filter & Sort</h3>
            <p className="mt-2 text-gray-600">
              Find tasks quickly with powerful filtering by status, priority, and sorting options.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-lg font-semibold text-gray-900">Secure Access</h3>
            <p className="mt-2 text-gray-600">
              Role-based access control ensures your tasks are private and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
