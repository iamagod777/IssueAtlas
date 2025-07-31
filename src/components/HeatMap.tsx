import React from 'react';
import { MapPin } from 'lucide-react';
import { Issue } from '../contexts/DataContext';

interface HeatMapProps {
  issues: Issue[];
}

const HeatMap = ({ issues }: HeatMapProps) => {
  // Group issues by approximate location
  const locationGroups = issues.reduce((acc, issue) => {
    const key = `${Math.round(issue.coordinates?.lat || 40.7128)}-${Math.round(issue.coordinates?.lng || -74.0060)}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, Issue[]>);

  const getIntensityColor = (count: number) => {
    if (count >= 10) return 'bg-red-500';
    if (count >= 7) return 'bg-red-400';
    if (count >= 5) return 'bg-orange-500';
    if (count >= 3) return 'bg-yellow-500';
    if (count >= 1) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getIntensityLabel = (count: number) => {
    if (count >= 10) return 'Very High';
    if (count >= 7) return 'High';
    if (count >= 5) return 'Medium';
    if (count >= 3) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Issue Density by Area</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Intensity:</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">High</span>
          </div>
        </div>
      </div>

      {/* Simulated Map View */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 min-h-96 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-200"></div>
        </div>
        
        <div className="relative z-10">
          <div className="grid grid-cols-6 gap-4 h-80">
            {/* Generate a grid of areas with different issue densities */}
            {Array.from({ length: 24 }, (_, index) => {
              const issueCount = Math.floor(Math.random() * 12);
              const hasRealIssues = Object.values(locationGroups)[index % Object.values(locationGroups).length];
              const actualCount = hasRealIssues?.length || issueCount;
              
              return (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                >
                  <div className={`w-full h-full rounded-lg ${getIntensityColor(actualCount)} opacity-70 hover:opacity-90 transition-opacity flex items-center justify-center`}>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                      <div className="font-medium">Zone {index + 1}</div>
                      <div>{actualCount} issues</div>
                      <div className="text-gray-300">{getIntensityLabel(actualCount)} density</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Area labels */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
          <h4 className="font-medium text-gray-900 text-sm">Community Layout</h4>
          <p className="text-xs text-gray-600 mt-1">Hover over areas to see issue density</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-full">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Total Locations</p>
              <p className="text-lg font-bold text-blue-600">{Object.keys(locationGroups).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-full">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-900">Hotspot Areas</p>
              <p className="text-lg font-bold text-orange-600">
                {Object.values(locationGroups).filter(group => group.length >= 3).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-full">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Coverage</p>
              <p className="text-lg font-bold text-green-600">100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;