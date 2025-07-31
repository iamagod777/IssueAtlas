import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, User, MapPin, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import IssueCard from './IssueCard';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const { getIssuesByTechnician, technicians, updateTechnicianAvailability, updateIssue } = useData();
  
  const technician = technicians.find(t => t.id === user?.id);
  const assignedIssues = getIssuesByTechnician(user?.id || '');
  const activeIssues = assignedIssues.filter(issue => issue.status !== 'Resolved');
  const completedIssues = assignedIssues.filter(issue => issue.status === 'Resolved');

  const toggleAvailability = () => {
    if (technician) {
      updateTechnicianAvailability(technician.id, !technician.available);
    }
  };

  const handleStatusUpdate = (issueId: string, newStatus: string) => {
    updateIssue(issueId, { status: newStatus as any });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technician Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>

        {/* Availability Toggle */}
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Availability</span>
            <button
              onClick={toggleAvailability}
              className={`flex items-center transition-colors ${
                technician?.available ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {technician?.available ? (
                <ToggleRight className="h-8 w-8" />
              ) : (
                <ToggleLeft className="h-8 w-8" />
              )}
            </button>
            <span className={`text-sm font-medium ${
              technician?.available ? 'text-green-600' : 'text-red-600'
            }`}>
              {technician?.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>

      {/* Technician Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-orange-600">{activeIssues.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{technician?.completedIssues || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{technician?.rating || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className={`text-sm font-bold ${
                technician?.available ? 'text-green-600' : 'text-red-600'
              }`}>
                {technician?.available ? 'Available' : 'Unavailable'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              technician?.available ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <User className={`h-6 w-6 ${
                technician?.available ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Skills</h3>
        <div className="flex flex-wrap gap-2">
          {technician?.skills.map(skill => (
            <span
              key={skill}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                skill === 'Electrical' ? 'bg-yellow-100 text-yellow-800' :
                skill === 'Plumbing' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Task Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Task Queue</h2>
          <p className="text-gray-600 mt-1">Issues assigned to you</p>
        </div>
        
        <div className="p-6">
          {activeIssues.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No active tasks at the moment. Great work!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeIssues.map(issue => (
                <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                  <IssueCard issue={issue} showActions={true} onStatusUpdate={handleStatusUpdate} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Completions */}
      {completedIssues.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recently Completed</h2>
            <p className="text-gray-600 mt-1">Your recent work history</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {completedIssues.slice(0, 3).map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;