'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/login'); // Login olmayıbsa birbaşa loginə atır
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/user/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Çıxış zamanı xəta baş verdi');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-black">Yüklənir...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-white">
      {/* Loqo */}
      <div className="py-8">
        <h1 className="text-2xl font-black tracking-widest text-black">O L A F</h1>
      </div>

      {/* Mərkəzi Hissə */}
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-black">My Account</h2>
          <p className="text-sm text-gray-500 mt-2">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm"
        >
          Log Out
        </button>

        <div>
          <button
            onClick={() => router.push('/')}
            className="text-xs text-gray-600 underline hover:text-black"
          >
            Ana səhifəyə qayıt
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4">
        <a href="#" className="text-xs text-gray-400 hover:underline">
          Privacy policy
        </a>
      </div>
    </div>
  );
}