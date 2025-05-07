import React from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

function StudentDashboard() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <p className="text-2xl font-bold text-gray-800">
        Student Dashboard
      </p>
      {/* Dashboard Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-1">Graduation Status</h2>
          <p className="text-sm text-gray-700">Current Status: Approved</p>
        </div>

        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-2">Certification Status</h2>
          <p className="text-sm text-gray-700 mb-2">Current Status: Needs Exmatriculation</p>
          <p className="text-sm text-gray-500 mb-3">You need to complete the exmatriculation process.</p>
          <button className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800">Download Exmatriculation Form</button>
        </div>

        <div className="bg-white shadow p-4 rounded-xl md:col-span-1">
          <h2 className="text-lg font-semibold mb-1">Graduation Ceremony</h2>
          <p className="text-sm text-gray-700 mb-4">Ceremony Details: [Date, Time, Location]</p>
          <div className="flex gap-3">
            <Button variant="contained" sx={{ backgroundColor: '#000000', color: '#fff' }}>Attend Ceremony</Button>
            <Button variant="outlined" color="inherit">Not Attend Ceremony</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
