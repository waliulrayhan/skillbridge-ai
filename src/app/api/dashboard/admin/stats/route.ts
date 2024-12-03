import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch admin statistics
    const [
      totalUsers,
      totalCourses,
      userTypes,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      }),
      prisma.user.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
    ]);

    // Calculate active users (users who logged in in the last 30 days)
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalRevenue: 0, // Implement based on your payment system
      activeUsers,
      userTypes: userTypes.map(type => ({
        name: type.role,
        value: type._count.role
      })),
      recentActions: recentUsers.map(user => ({
        id: user.id,
        action: 'joined the platform',
        user: user.name,
        timestamp: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 