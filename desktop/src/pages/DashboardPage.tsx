import React from 'react'

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Total Applicants</h3>
          <p className="text-3xl font-bold text-blue-400">1,234</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Active Jobs</h3>
          <p className="text-3xl font-bold text-green-400">56</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Processed Visas</h3>
          <p className="text-3xl font-bold text-yellow-400">89</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white">Revenue</h3>
          <p className="text-3xl font-bold text-purple-400">$12,345</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
