import React from "react";

const SidebarSkeleton = () => {
  return (
    <div className="bg-base-100 h-full w-[250px] md:w-[300px] flex flex-col border-r border-base-300">
      {/* Sidebar Header Skeleton */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 animate-pulse">
        <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
        <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
      </div>

      {/* Sidebar Navigation Skeleton */}
      <nav className="flex flex-col gap-2 p-4 flex-1">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-200 animate-pulse"
            >
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
            </div>
          ))}
      </nav>

      {/* Sidebar Footer Skeleton */}
      <div className="p-4 border-t border-base-300 animate-pulse">
        <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
