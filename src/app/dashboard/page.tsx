'use client';
import { useSession } from 'next-auth/react';
import DashboardLayout from '../components/DashboardLayout';
import StudentDashboard from './StudentDashboard';
import EducatorDashboard from './EducatorDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { data: session } = useSession();

  const getDashboardComponent = () => {
    switch (session?.user?.role) {
      case 'STUDENT':
        return <StudentDashboard />;
      case 'EDUCATOR':
        return <EducatorDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <DashboardLayout>
      {getDashboardComponent()}
    </DashboardLayout>
  );
} 