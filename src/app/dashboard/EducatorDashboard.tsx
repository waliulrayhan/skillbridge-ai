'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CourseStats {
  totalStudents: number;
  activeStudents: number;
  averageCompletion: number;
  totalCourses: number;
  recentActivity: Activity[];
  studentEngagement: EngagementData[];
}

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

interface EngagementData {
  date: string;
  students: number;
}

export default function EducatorDashboard() {
  const [stats, setStats] = useState<CourseStats>({
    totalStudents: 0,
    activeStudents: 0,
    averageCompletion: 0,
    totalCourses: 0,
    recentActivity: [],
    studentEngagement: []
  });

  useEffect(() => {
    const fetchEducatorStats = async () => {
      try {
        const response = await fetch('/api/dashboard/educator/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching educator stats:', error);
      }
    };

    fetchEducatorStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="text-sm font-medium text-gray-500">Total Students</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalStudents}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="text-sm font-medium text-gray-500">Active Students</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.activeStudents}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="text-sm font-medium text-gray-500">Average Completion Rate</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.averageCompletion}%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="text-sm font-medium text-gray-500">Total Courses</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalCourses}</div>
        </motion.div>
      </div>

      {/* Student Engagement Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-4">Student Engagement</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.studentEngagement}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {activity.type === 'enrollment' ? '📚' : '✅'}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 