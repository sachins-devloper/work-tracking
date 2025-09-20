import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MemberDetails = ({ userId, onClose }) => {
  const { theme } = useTheme();
  const [memberData, setMemberData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchMemberData();
  }, [userId, dateFilter]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserActivities(userId, { date: dateFilter });
      setMemberData(response.data.user);
      setActivities(response.data.activities);
    } catch (error) {
      toast.error('Failed to fetch member details');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading member details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {memberData?.username} - Member Details
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {memberData?.role === 'admin' ? 'Administrator' : 'Team Member'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Member Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Member Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{memberData?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {memberData?.profile?.email || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {memberData?.profile?.mobile || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  memberData?.role === 'admin' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {memberData?.role}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {memberData?.createdAt ? format(new Date(memberData.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Activities</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white font-semibold">
                  {activities.length}
                </p>
              </div>
            </div>
          </div>

          {/* Activities Filter */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activities</h3>
              <div className="flex items-center space-x-4">
                <label htmlFor="date-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by Date:
                </label>
                <input
                  type="date"
                  id="date-filter"
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">
                  {dateFilter ? 'No activities found for the selected date.' : 'No activities found.'}
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {activity.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 break-words">
                        {activity.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {format(new Date(activity.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
