import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'EDUCATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const educatorId = parseInt(session.user.id);

    // Fetch educator statistics
    const [
      totalStudents,
      courses,
      courseProgress
    ] = await Promise.all([
      prisma.userCourseProgress.count({
        where: {
          course: {
            createdById: educatorId
          }
        },
        distinct: ['userId']
      }),
      prisma.course.findMany({
        where: {
          createdById: educatorId
        }
      }),
      prisma.userCourseProgress.findMany({
        where: {
          course: {
            createdById: educatorId
          }
        },
        include: {
          user: true
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 10
      })
    ]);

    // Calculate active students (those who made progress in the last 30 days)
    const activeStudents = await prisma.userCourseProgress.count({
      where: {
        course: {
          createdById: educatorId
        },
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      distinct: ['userId']
    });

    // Calculate average completion rate
    const averageCompletion = courseProgress.reduce((acc, curr) => acc + curr.progress, 0) / 
      (courseProgress.length || 1);

    return NextResponse.json({
      totalStudents,
      activeStudents,
      averageCompletion: Math.round(averageCompletion),
      totalCourses: courses.length,
      recentActivity: courseProgress.map(progress => ({
        id: progress.id,
        type: 'progress',
        description: `${progress.user.name} made progress in ${progress.course.title}`,
        timestamp: progress.updatedAt
      })),
      studentEngagement: [] // You would need to implement this based on your needs
    });
  } catch (error) {
    console.error('Error fetching educator stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 