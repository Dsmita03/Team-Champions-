// // app/appointments/page.jsx (or .tsx)
// 'use client'; // Important for client-side interactivity like button clicks and if you use React hooks

// import Image from 'next/image';
// import { FaArrowLeft, FaCalendarAlt, FaPlus } from 'react-icons/fa';

// export default function AppointmentScheduledPage() { // Renamed for clarity, can be AppointmentScheduled
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Header */}
//       <header className="bg-white p-4 shadow-sm">
//         <div className="flex items-center justify-between text-sm text-gray-600">
//         </div>
//         <div className="flex items-center mt-4">
//           <FaArrowLeft className="text-xl text-gray-700 cursor-pointer" />
//           <h1 className="text-xl font-semibold text-gray-800 ml-4">Appointment Scheduled</h1>
//         </div>
//       </header>

//       <main className="grow p-4 space-y-4">
//         {/* Doctor Information Card */}
//         <section className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
//           <div className="relative w-24 h-24 rounded-full overflow-hidden">
//             <Image
//               src="/Dr. Vikram Rao.png" // Add your image here
//               alt="Dr. Kumar Das"
//               layout="fill"
//               // objectFit="cover"
//             />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">Dr.Kumar Das</h2>
//             <p className="text-sm text-gray-600">Cardiologist - Dombivali</p>
//             <p className="text-xs text-gray-500">MBBS,MD (Internal Medicine)</p>
//           </div>
//         </section>

//         {/* Appointment Details Card */}
//         <section className="bg-white rounded-lg shadow-md p-4 space-y-4">
//           <div>
//             <h3 className="text-sm text-gray-500 mb-1">Appointment Number:</h3>
//             <p className="text-lg font-bold text-gray-800">#34</p>
//           </div>
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="text-sm text-gray-500 mb-1">Status</h3>
//               <p className="text-md font-semibold text-green-600">Active</p>
//             </div>
//             <div>
//               <h3 className="text-sm text-gray-500 mb-1">Reporting Time</h3>
//               <p className="text-md font-semibold text-gray-800">Oct 27, 2023 7:30 PM</p>
//             </div>
//           </div>
//           <button className="flex items-center justify-center w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-200">
//             <FaCalendarAlt className="mr-2" /> Add to calendar
//           </button>
//         </section>

//         {/* Add Patient Details */}
//         <section className="pt-2">
//           <h3 className="text-md font-medium text-gray-700 mb-2">Add Patient Details</h3>
//           <button className="flex items-center justify-center w-full px-4 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-200">
//             <FaPlus className="mr-2" /> Add Patient Details
//           </button>
//         </section>
//       </main>

//       {/* Footer Button */}
//       <footer className="p-4 bg-white border-t border-gray-200">
//         <button className="w-full bg-blue-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-200 shadow-lg">
//           View My Appointment
//         </button>
//       </footer>
//     </div>
//   );
// }

// app/appointments/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft, FaCalendarAlt, FaPlus } from 'react-icons/fa';

import data from '../data/data.json';
import Link from 'next/link';

export default function AppointmentScheduledPage() {
  const searchParams = useSearchParams();
  
  // Get parameters from URL (you'd set these when navigating from booking page)
  const doctorId = searchParams.get('doctorId');
  const userId = searchParams.get('userId');
  const appointmentDate = searchParams.get('date');
  const appointmentTime = searchParams.get('time');

  // Find the specific doctor and user
  const doctor = data.doctors.find(d => d.id === doctorId) || data.doctors[1];
  const user = data.users.find(u => u.id === userId) || data.users[1];

  // Generate appointment data
  const appointmentData = {
    id: `#${Math.floor(Math.random() * 100) + 1}`,
    status: "Active",
    date: appointmentDate || doctor.availableDates[0],
    time: appointmentTime || doctor.availableTimes[0],
    reportingTime: getReportingTime(appointmentDate || doctor.availableDates[0], appointmentTime || doctor.availableTimes[0])
  };

  function getReportingTime(date: string, time: string) {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const reportingDateTime = new Date(appointmentDateTime.getTime() - 30 * 60000); // 30 minutes before
    
    return reportingDateTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
       <div className="flex items-center mt-2">
            <Link href="/home" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <FaArrowLeft className="text-xl text-gray-700" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800 ml-4">Appointment Scheduled</h1>
          </div>
      </header>

      <main className="grow p-4 space-y-4">
        {/* Doctor Information Card */}
        <section className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={doctor.image || "/default-doctor.png"}
                alt={doctor.name}
                width={96}
                height={96}
                className="object-cover min-w-full min-h-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
            <p className="text-sm text-gray-600">
              {doctor.speciality} • {doctor.location}
            </p>
            <p className="text-xs text-gray-500">
              {doctor.qualification || "MBBS, MD"} • {doctor.experience} years experience
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600 ml-1">
                  {doctor.rating} ({doctor.reviewCount || Math.floor(Math.random() * 50) + 10} reviews)
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600">₹{doctor.price}</span>
            </div>
          </div>
        </section>

        {/* Appointment Details Card */}
        <section className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Appointment ID</h3>
              <p className="text-lg font-bold text-gray-800">{appointmentData.id}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Status</h3>
              <p className="text-md font-semibold text-green-600">{appointmentData.status}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date:</span>
              <span className="text-sm font-medium text-gray-800">{appointmentData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Time:</span>
              <span className="text-sm font-medium text-gray-800">{appointmentData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Reporting Time:</span>
              <span className="text-sm font-medium text-gray-800">{appointmentData.reportingTime}</span>
            </div>
          </div>

          <button className="flex items-center justify-center w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-200">
            <FaCalendarAlt className="mr-2" /> Add to calendar
          </button>
        </section>

        {/* Patient Information */}
        <section className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-md font-medium text-gray-700 mb-3">Patient Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Name:</span>
              <span className="text-sm font-medium text-gray-800">
                {user.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Email:</span>
              <span className="text-sm font-medium text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Mobile:</span>
              <span className="text-sm font-medium text-gray-800">{user.mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Location:</span>
              <span className="text-sm font-medium text-gray-800">{user.location}</span>
            </div>
          </div>
        </section>

        {/* Add Patient Details */}
        <section className="pt-2">
          <h3 className="text-md font-medium text-gray-700 mb-2">Add Additional Patient Details</h3>
          <button className="flex items-center justify-center w-full px-4 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-200">
            <FaPlus className="mr-2" /> Add Medical History & Documents
          </button>
        </section>
      </main>

      {/* Footer Button */}
      <footer className="p-4 bg-white border-t border-gray-200">
        <button className="w-full bg-blue-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-200 shadow-lg">
          View My Appointment
        </button>
      </footer>
    </div>
  );
}

