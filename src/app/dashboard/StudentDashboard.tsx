'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    coursesInProgress: 0,
    completedCourses: 0,
    certifications: 0,
    skillsLearned: 0,
  });

  useEffect(() => {
    // Fetch student statistics
    // This would be replaced with actual API calls
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/student/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
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
          <div className="text-sm font-medium text-gray-500">Courses In Progress</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.coursesInProgress}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="text-sm font-medium text-gray-500">Completed Courses</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.completedCourses}</div>
        </motion.div>
        
        {/* Add more stat cards */}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {/* Add recent activity list */}
      </div>

      {/* Recommended Courses */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recommended Courses</h2>
        {/* Add course recommendations */}
      </div>
    </div>
  );
} 