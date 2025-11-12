/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

interface FeedbackData {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientEmail: string;
  patientName: string;
  consultingRating: number;
  hospitalRating: number;
  waitingTimeRating: number;
  wouldRecommend: boolean | null;
  additionalComments: string;
  appointmentDate: string;
  appointmentTime: string;
  submittedAt: string;
  status: string;
}

interface DataStore {
  feedbacks?: FeedbackData[];
  users?: Array<{ email: string; name: string; [key: string]: any }>;
  bookings?: Array<{ patientEmail: string; patientName: string; [key: string]: any }>;
  appointments?: Array<{ patientEmail: string; patientName: string; [key: string]: any }>;
}

async function readDataFile(): Promise<DataStore> {
  try {
    const data = (await redis.get('data')) as DataStore || { feedbacks: [] };
    return data;
  } catch (error) {
    console.error('Error reading data from Redis:', error);
    return { feedbacks: [] };
  }
}

async function writeDataFile(data: DataStore): Promise<boolean> {
  try {
    await redis.set('data', data);
    return true;
  } catch (error) {
    console.error('Error writing data to Redis:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      appointmentId, 
      doctorId, 
      doctorName, 
      patientEmail, 
      patientName,
      consultingRating, 
      hospitalRating, 
      waitingTimeRating, 
      wouldRecommend, 
      additionalComments,
      date,
      time
    } = body;

    // Validate required fields
    if (!appointmentId || !doctorId || !patientEmail || !consultingRating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read current data
    const data = await readDataFile();
    
    // Initialize feedbacks array if it doesn't exist
    if (!data.feedbacks) {
      data.feedbacks = [];
    }

    // Try to find patient name from bookings or appointments if not provided
    let finalPatientName = patientName || 'Unknown Patient';
    
    if (!patientName || patientName === 'Unknown Patient') {
      // First, look for patient name in users table
      if (data.users && Array.isArray(data.users)) {
        const user = data.users.find((u) => 
          u.email === patientEmail && u.name && u.name !== 'Unknown Patient'
        );
        if (user && user.name) {
          finalPatientName = user.name;
        }
      }
      
      // If not found in users, look in bookings
      if (finalPatientName === 'Unknown Patient' && data.bookings && Array.isArray(data.bookings)) {
        const booking = data.bookings.find((b) => 
          b.patientEmail === patientEmail && b.patientName && b.patientName !== 'Unknown Patient'
        );
        if (booking && booking.patientName) {
          finalPatientName = booking.patientName;
        }
      }
      
      // If still not found, look in appointments
      if (finalPatientName === 'Unknown Patient' && data.appointments && Array.isArray(data.appointments)) {
        const appointment = data.appointments.find((a) => 
          a.patientEmail === patientEmail && a.patientName && a.patientName !== 'Unknown Patient'
        );
        if (appointment && appointment.patientName) {
          finalPatientName = appointment.patientName;
        }
      }
    }

    // Create feedback object
    const feedback: FeedbackData = {
      id: `feedback_${appointmentId}_${Date.now()}`,
      appointmentId,
      doctorId,
      doctorName: doctorName || 'Unknown Doctor',
      patientEmail,
      patientName: finalPatientName,
      consultingRating,
      hospitalRating: hospitalRating || 0,
      waitingTimeRating: waitingTimeRating || 0,
      wouldRecommend: wouldRecommend ?? null,
      additionalComments: additionalComments || '',
      appointmentDate: date || '',
      appointmentTime: time || '',
      submittedAt: new Date().toISOString(),
      status: 'active'
    };

    // Add feedback to data
    data.feedbacks.push(feedback);

    // Save data back to Redis
    const saveSuccess = await writeDataFile(data);
    
    if (!saveSuccess) {
      return NextResponse.json(
        { success: false, error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: feedback.id
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const appointmentId = searchParams.get('appointmentId');

    // Read current data
    const data = await readDataFile();
    const allFeedbacks: FeedbackData[] = data.feedbacks || [];

    if (doctorId) {
      // Get all feedback for a specific doctor
      const doctorFeedbacks = allFeedbacks.filter(feedback => feedback.doctorId === doctorId);
      
      if (doctorFeedbacks.length === 0) {
        return NextResponse.json({
          success: true,
          feedbacks: [],
          averageRating: 0,
          totalReviews: 0
        });
      }

      // Sort by submission date (most recent first)
      const sortedFeedbacks = doctorFeedbacks.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      // Calculate average rating
      const totalRating = doctorFeedbacks.reduce((sum, feedback) => sum + feedback.consultingRating, 0);
      const averageRating = doctorFeedbacks.length > 0 ? (totalRating / doctorFeedbacks.length) : 0;

      return NextResponse.json({
        success: true,
        feedbacks: sortedFeedbacks,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: doctorFeedbacks.length
      });

    } else if (appointmentId) {
      // Get feedback for a specific appointment
      const feedback = allFeedbacks.find(f => f.appointmentId === appointmentId);

      return NextResponse.json({
        success: true,
        feedback: feedback || null
      });

    } else {
      // Get all feedbacks (admin use)
      const sortedFeedbacks = allFeedbacks.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      return NextResponse.json({
        success: true,
        feedbacks: sortedFeedbacks,
        totalReviews: allFeedbacks.length
      });
    }

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
