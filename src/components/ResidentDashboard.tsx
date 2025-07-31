import React, { useState, useRef } from 'react';
import { Plus, Camera, MapPin, Clock, CheckCircle, AlertCircle, Upload, X, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import IssueCard from './IssueCard';

const ResidentDashboard = () => {
  const { user } = useAuth();
  const { getIssuesByUser, addIssue } = useData();
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: user?.location || '',
    category: 'Civil' as 'Electrical' | 'Plumbing' | 'Civil',
    severity: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const userIssues = getIssuesByUser(user?.id || '');
  const openIssues = userIssues.filter(issue => issue.status !== 'Resolved');
  const resolvedIssues = userIssues.filter(issue => issue.status === 'Resolved');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addIssue({
      userId: user?.id || '',
      userName: user?.name || '',
      title: formData.title,
      description: formData.description,
      location: formData.location,
      category: formData.category,
      severity: formData.severity,
      status: 'Open',
      image: selectedImage || undefined
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      location: user?.location || '',
      category: 'Civil',
      severity: 'Medium'
    });
    setSelectedImage(null);
    setShowReportForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your maintenance requests and track their progress</p>
        </div>
        <button
          onClick={() => setShowReportForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          <span>Report Issue</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-orange-600">{openIssues.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {userIssues.filter(i => i.status === 'In Progress' || i.status === 'Assigned').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{resolvedIssues.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Issues</h2>
          <p className="text-gray-600 mt-1">Track the status of your reported maintenance requests</p>
        </div>
        
        <div className="p-6">
          {userIssues.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issues reported yet</h3>
              <p className="text-gray-600 mb-6">Get started by reporting your first maintenance issue</p>
              <button
                onClick={() => setShowReportForm(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Report Your First Issue</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {userIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Report New Issue</h3>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Photo (Optional)
                </label>
                <div className="space-y-3">
                  {selectedImage ? (
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-40 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="text-center">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload photo</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Brief description of the issue"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe the issue in detail..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/200 characters
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Block A, Apt 301"
                  />
                </div>
              </div>

              {/* AI Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-200 rounded-full">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">AI-Powered Classification</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Our AI will automatically categorize your issue and assign it to the right technician based on your description and photo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Submit Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentDashboard;