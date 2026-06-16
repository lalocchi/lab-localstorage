'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // If no token, kick them back to login page
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    // Remove the token and redirect to login
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow-md space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome! 👋</h1>
        <p className="text-gray-600 text-sm">
          You can see this page because a valid JWT is currently stored in your browser's{' '}
          <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-indigo-600">localStorage</code>.
        </p>
        
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}