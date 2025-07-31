import React, { useState } from 'react';
import { BarChart3, MapPin, Users, AlertTriangle, CheckCircle, Clock, Filter, Download, Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import IssueCard from './IssueCard';
import HeatMap from './HeatMap';

const AdminDashboard = () => {
  const { issues, technicians, assignIssue } = useData();
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Calculate statistics
  const totalIssues = issues.length;
  const openIssues = issues.filter(i => i.status === 'Open').length;
  const assignedIssues = issues.filter(i => i.status === 'Assigned').length;
  const inProgressIssues = issues.filter(i => i.status === 'In Progress').length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;
  
  const availableTechnicians = technicians.filter(t => t.available).length;
  
  // Category breakdown
  const categoryStats = {
    Electrical: issues.filter(i => i.category === 'Electrical').length,
    Plumbing: issues.filter(i => i.category === 'Plumbing').length,
    Civil: issues.filter(i => i.category === 'Civil').length
  };

  // Filter issues based on selected filter
  const filteredIssues = issues.filter(issue => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'open') return issue.status === 'Open';
    if (selectedFilter === 'assigned') return issue.status === 'Assigned';
    if (selectedFilter === 'in-progress') return issue.status === 'In Progress';
    if (selectedFilter === 'resolved') return issue.status === 'Resolved';
    return true;
  });

  const handleReassign = (issueId: string, technicianId: string) => {
    assignIssue(issueId, technicianId);
  };

  const exportData = () => {
    const csvContent = issues.map(issue => ({
      ID: issue.id,
      Title: issue.title,
      Category: issue.category,
      Status: issue.status,
      Severity: issue.severity,
      Reporter: issue.userName,
      Location: issue.location,
      AssignedTo: issue.assignedTechnicianName || 'Unassigned',
      CreatedAt: issue.createdAt.toISOString(),
      UpdatedAt: issue.updatedAt.toISOString()
    }));

    const csv = [
      Object.keys(csvContent[0]).join(','),
      ...csvContent.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'issues-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all maintenance operations</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            onClick={exportData}
            className="inline-flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-lg">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Issues</p>
              <p className="text-3xl font-bold">{totalIssues}</p>
              <p className="text-sm text-blue-100 mt-1">All time</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <BarChart3 className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Open Issues</p>
              <p className="text-3xl font-bold">{openIssues}</p>
              <p className="text-sm text-orange-100 mt-1">Needs attention</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Available Techs</p>
              <p className="text-3xl font-bold">{availableTechnicians}</p>
              <p className="text-sm text-green-100 mt-1">Ready to work</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Resolution Rate</p>
              <p className="text-3xl font-bold">{Math.round((resolvedIssues / totalIssues) * 100)}%</p>
              <p className="text-sm text-purple-100 mt-1">This period</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Status Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Open</span>
              </div>
              <span className="font-semibold text-gray-900">{openIssues}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">Assigned</span>
              </div>
              <span className="font-semibold text-gray-900">{assignedIssues}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">In Progress</span>
              </div>
              <span className="font-semibold text-gray-900">{inProgressIssues}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Resolved</span>
              </div>
              <span className="font-semibold text-gray-900">{resolvedIssues}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">Electrical</span>
              </div>
              <span className="font-semibold text-gray-900">{categoryStats.Electrical}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Plumbing</span>
              </div>
              <span className="font-semibold text-gray-900">{categoryStats.Plumbing}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Civil</span>
              </div>
              <span className="font-semibold text-gray-900">{categoryStats.Civil}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heat Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Issue Heat Map</h2>
          </div>
          <p className="text-gray-600 mt-1">Geographic distribution of reported issues</p>
        </div>
        <div className="p-6">
          <HeatMap issues={issues} />
        </div>
      </div>

      {/* Issues Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Issues Management</h2>
              <p className="text-gray-600 mt-1">Review and manage all reported issues</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Issues</option>
                  <option value="open">Open Only</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-600">No issues match the current filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map(issue => (
                <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                  <IssueCard 
                    issue={issue} 
                    showAdminActions={true}
                    technicians={technicians}
                    onReassign={handleReassign}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;