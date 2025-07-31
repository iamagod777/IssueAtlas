import React, { useState } from 'react';
import { Clock, User, MapPin, AlertTriangle, CheckCircle, Settings, Zap, Calendar, Camera } from 'lucide-react';
import { Issue, Technician } from '../contexts/DataContext';

interface IssueCardProps {
  issue: Issue;
  showActions?: boolean;
  showAdminActions?: boolean;
  technicians?: Technician[];
  onStatusUpdate?: (issueId: string, newStatus: string) => void;
  onReassign?: (issueId: string, technicianId: string) => void;
}

const IssueCard = ({ 
  issue, 
  showActions = false, 
  showAdminActions = false,
  technicians = [],
  onStatusUpdate,
  onReassign
}: IssueCardProps) => {
  const [showReassignModal, setShowReassignModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800 border-red-200';
      case 'Assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Electrical': return 'bg-yellow-100 text-yellow-800';
      case 'Plumbing': return 'bg-blue-100 text-blue-800';
      case 'Civil': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const handleReassign = (technicianId: string) => {
    if (onReassign) {
      onReassign(issue.id, technicianId);
      setShowReassignModal(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 pr-4">{issue.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">{issue.description}</p>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{issue.userName}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{issue.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(issue.createdAt)}</span>
              </div>
              {issue.image && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Camera className="h-4 w-4" />
                  <span>Has photo</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(issue.category)}`}>
                {issue.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                {issue.severity} Priority
              </span>
              {issue.aiConfidence && (
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">
                    AI: {Math.round(issue.aiConfidence * 100)}%
                  </span>
                </div>
              )}
            </div>

            {issue.assignedTechnicianName && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">Assigned to:</span>
                  <span className="font-medium text-gray-900">{issue.assignedTechnicianName}</span>
                </div>
              </div>
            )}
          </div>

          {issue.image && (
            <div className="mt-4 lg:mt-0 lg:ml-6">
              <img
                src={issue.image}
                alt="Issue"
                className="w-full lg:w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Technician Actions */}
        {showActions && issue.status !== 'Resolved' && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {issue.status === 'Assigned' && (
              <button
                onClick={() => onStatusUpdate?.(issue.id, 'In Progress')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Clock className="h-4 w-4" />
                <span>Start Work</span>
              </button>
            )}
            {issue.status === 'In Progress' && (
              <button
                onClick={() => onStatusUpdate?.(issue.id, 'Resolved')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mark Complete</span>
              </button>
            )}
          </div>
        )}

        {/* Admin Actions */}
        {showAdminActions && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {issue.status !== 'Resolved' && (
              <button
                onClick={() => setShowReassignModal(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Reassign</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Reassign Issue</h3>
              <p className="text-gray-600 mt-1">Select a technician for this issue</p>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {technicians
                  .filter(tech => tech.skills.includes(issue.category))
                  .map(tech => (
                    <button
                      key={tech.id}
                      onClick={() => handleReassign(tech.id)}
                      className={`w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors ${
                        tech.available ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{tech.name}</div>
                          <div className="text-sm text-gray-600">
                            Skills: {tech.skills.join(', ')}
                          </div>
                          <div className="text-sm text-gray-500">
                            Rating: {tech.rating}/5 • Completed: {tech.completedIssues}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tech.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tech.available ? 'Available' : 'Busy'}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowReassignModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IssueCard;