'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const navigationItems = {
    STUDENT: [
      { name: 'My Courses', href: '/dashboard/courses', icon: '📚' },
      { name: 'Skills', href: '/dashboard/skills', icon: '🎯' },
      { name: 'Job Matches', href: '/dashboard/jobs', icon: '💼' },
      { name: 'Certifications', href: '/dashboard/certifications', icon: '🏆' },
    ],
    EDUCATOR: [
      { name: 'My Courses', href: '/educator/courses', icon: '📚' },
      { name: 'Students', href: '/educator/students', icon: '👥' },
      { name: 'Analytics', href: '/educator/analytics', icon: '📊' },
    ],
    ADMIN: [
      { name: 'Users', href: '/admin/users', icon: '👥' },
      { name: 'Courses', href: '/admin/courses', icon: '📚' },
      { name: 'Analytics', href: '/admin/analytics', icon: '📊' },
      { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ],
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  SkillBridge AI
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {session?.user?.role && navigationItems[session.user.role as keyof typeof navigationItems].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.icon} {item.name}
                  </Link>
                ))}
              </div>
              
              <div className="ml-3 relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {session?.user?.username?.[0].toUpperCase()}
                  </div>
                </button>
                
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => router.push('/auth/logout')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 