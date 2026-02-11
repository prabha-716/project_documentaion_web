import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;

    if (token && typeof token === 'string') {
      localStorage.setItem('token', token);
      
      // Fetch user data
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          router.push('/dashboard');
        })
        .catch(() => {
          router.push('/login');
        });
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}
