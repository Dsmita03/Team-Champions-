/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app', 'data', 'data.json');

// GET: Fetch appointments (filter by doctorId or patientId)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    let appointments = data.appointments || [];

    // Filter by doctorId if provided
    if (doctorId) {
      appointments = appointments.filter((apt: any) => apt.doctorId === doctorId);
    }

    // Filter by patientId if provided
    if (patientId) {
      appointments = appointments.filter((apt: any) => apt.patientId === patientId);
    }

    return NextResponse.json(
      { 
        success: true, 
        appointments,
        count: appointments.length 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch appointments',
        appointments: [] 
      },
      { status: 500 }
    );
  }
}

// POST: Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    const newAppointment = {
      id: `apt${Date.now()}`,
      ...body,
      patientId: body.patientId || body.id,
      status: body.status || 'upcoming',
      createdAt: new Date().toISOString()
    };

    data.appointments = data.appointments || [];
    data.appointments.push(newAppointment);

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(
      { 
        success: true, 
        appointment: newAppointment,
        message: 'Appointment created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create appointment' 
      },
      { status: 500 }
    );
  }
}

// PATCH: Update appointment
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    const appointmentIndex = data.appointments?.findIndex((apt: any) => apt.id === id);

    if (appointmentIndex === -1 || appointmentIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Update appointment with all provided fields
    data.appointments[appointmentIndex] = {
      ...data.appointments[appointmentIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(
      { 
        success: true, 
        appointment: data.appointments[appointmentIndex],
        message: 'Appointment updated successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE: Remove appointment
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    const appointmentIndex = data.appointments?.findIndex((apt: any) => apt.id === id);

    if (appointmentIndex === -1 || appointmentIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const deletedAppointment = data.appointments[appointmentIndex];
    data.appointments.splice(appointmentIndex, 1);

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Appointment deleted successfully',
        appointment: deletedAppointment
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
