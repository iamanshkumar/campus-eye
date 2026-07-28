import React from 'react';

export const CompanyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded-md w-1/3" />
          <div className="h-3 bg-gray-200 rounded-md w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded-md w-full" />
        <div className="h-4 bg-gray-200 rounded-md w-4/5" />
      </div>
      <div className="flex gap-3">
        <div className="h-8 bg-gray-200 rounded-full w-24" />
        <div className="h-8 bg-gray-200 rounded-full w-24" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
    </div>
  );
};

export const ExperienceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse mb-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded-md w-32" />
            <div className="h-3 bg-gray-200 rounded-md w-20" />
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-24" />
      </div>
      <div className="space-y-2 py-2">
        <div className="h-4 bg-gray-200 rounded-md w-full" />
        <div className="h-4 bg-gray-200 rounded-md w-full" />
        <div className="h-4 bg-gray-200 rounded-md w-3/4" />
      </div>
      <div className="flex justify-between border-t pt-3">
        <div className="flex gap-4">
          <div className="h-6 bg-gray-200 rounded-md w-12" />
          <div className="h-6 bg-gray-200 rounded-md w-12" />
        </div>
        <div className="h-6 bg-gray-200 rounded-md w-20" />
      </div>
    </div>
  );
};
