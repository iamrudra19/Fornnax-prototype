import React from 'react';

interface SkeletonLoaderProps {
  tab: string;
}

export default function SkeletonLoader({ tab }: SkeletonLoaderProps) {
  // Render based on the layout of the specific active tab
  switch (tab) {
    case 'dashboard':
      return (
        <div className="space-y-6 animate-pulse select-none">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-96 bg-zinc-800/60 rounded"></div>
            </div>
            <div className="h-8 w-24 bg-zinc-800 rounded"></div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-28 flex flex-col justify-between">
                <div className="h-3 w-20 bg-zinc-800 rounded"></div>
                <div className="h-8 w-16 bg-zinc-800 rounded"></div>
                <div className="h-2 w-full bg-zinc-800/40 rounded"></div>
              </div>
            ))}
          </div>

          {/* Two Columns Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Ticker Window Box */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-[340px] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 w-40 bg-zinc-800 rounded"></div>
                  <div className="h-3 w-24 bg-zinc-800/60 rounded"></div>
                </div>
                <div className="space-y-3 flex-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-zinc-800/40 rounded-[8px] border border-zinc-800/30"></div>
                  ))}
                </div>
              </div>

              {/* Chart Skeletons */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-64 flex flex-col justify-between">
                <div className="h-4 w-48 bg-zinc-800 rounded"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3 w-24 bg-zinc-800 rounded"></div>
                        <div className="h-3 w-12 bg-zinc-800 rounded"></div>
                      </div>
                      <div className="h-6 bg-zinc-800/40 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-[340px] flex flex-col justify-between">
                <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-3.5 w-24 bg-zinc-800 rounded"></div>
                      <div className="h-4 w-8 bg-zinc-800 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-48 flex flex-col justify-between">
                <div className="h-4 w-28 bg-zinc-800 rounded"></div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-zinc-800 rounded"></div>
                  <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'inbox':
      return (
        <div className="space-y-6 animate-pulse select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div className="space-y-2">
              <div className="h-6 w-56 bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-80 bg-zinc-800/60 rounded"></div>
            </div>
            <div className="h-7 w-32 bg-zinc-800 rounded"></div>
          </div>

          {/* Filter Row */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-zinc-800/60 rounded-[8px]"></div>
              ))}
            </div>
          </div>

          {/* Table Skeletons */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[10px] overflow-hidden">
            <div className="border-b border-zinc-800 p-4 bg-zinc-900/80">
              <div className="grid grid-cols-7 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-3 bg-zinc-800 rounded"></div>
                ))}
              </div>
            </div>
            <div className="divide-y divide-zinc-800/40">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 grid grid-cols-7 gap-4 items-center">
                  <div className="h-4 w-16 bg-zinc-800/60 rounded"></div>
                  <div className="h-4 w-24 bg-zinc-800/60 rounded col-span-2"></div>
                  <div className="h-4 w-32 bg-zinc-800/60 rounded col-span-2"></div>
                  <div className="h-3 w-12 bg-zinc-800/40 rounded"></div>
                  <div className="h-4 w-16 bg-zinc-800/60 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'spec-collector':
      return (
        <div className="space-y-6 animate-pulse select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div className="space-y-2">
              <div className="h-6 w-60 bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-80 bg-zinc-800/60 rounded"></div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column Checklist */}
            <div className="lg:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-[500px] flex flex-col justify-between">
              <div className="h-4 w-32 bg-zinc-800 rounded mb-4"></div>
              <div className="space-y-4 flex-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex space-x-3 items-center">
                    <div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
                    <div className="h-3 w-32 bg-zinc-800/60 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-8 bg-zinc-800 rounded mt-4"></div>
            </div>

            {/* Right Column Chat Screen */}
            <div className="lg:col-span-8 bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-[500px] flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3 mb-4">
                <div className="h-4 w-40 bg-zinc-800 rounded"></div>
                <div className="h-4 w-12 bg-zinc-800 rounded"></div>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-1">
                <div className="flex justify-start">
                  <div className="h-12 w-48 bg-zinc-800/40 rounded-r-[12px] rounded-tl-[12px]"></div>
                </div>
                <div className="flex justify-end">
                  <div className="h-8 w-32 bg-zinc-800/60 rounded-l-[12px] rounded-tr-[12px]"></div>
                </div>
                <div className="flex justify-start">
                  <div className="h-10 w-56 bg-zinc-800/40 rounded-r-[12px] rounded-tl-[12px]"></div>
                </div>
              </div>
              <div className="h-10 bg-zinc-800/60 rounded-[8px]"></div>
            </div>
          </div>
        </div>
      );

    case 'briefs':
      return (
        <div className="space-y-6 animate-pulse select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-80 bg-zinc-800/60 rounded"></div>
            </div>
          </div>

          {/* Master Detail Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list */}
            <div className="lg:col-span-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-[8px] h-20 flex flex-col justify-between">
                  <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                  <div className="h-3 w-20 bg-zinc-800/50 rounded"></div>
                </div>
              ))}
            </div>

            {/* Right brief card */}
            <div className="lg:col-span-8 bg-zinc-900/50 border-2 border-zinc-800 rounded-[10px] p-6 h-[500px] flex flex-col justify-between">
              <div className="border-b border-zinc-800 pb-4 mb-4 flex justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-zinc-800 rounded"></div>
                  <div className="h-3 w-24 bg-zinc-800/50 rounded"></div>
                </div>
                <div className="h-10 w-10 bg-zinc-800 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-16 bg-zinc-800 rounded"></div>
                    <div className="h-4 w-full bg-zinc-800/40 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-10 bg-zinc-800/60 rounded-[8px] mt-4"></div>
            </div>
          </div>
        </div>
      );

    case 'lead-finder':
      return (
        <div className="space-y-6 animate-pulse select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div className="space-y-2">
              <div className="h-6 w-52 bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-80 bg-zinc-800/60 rounded"></div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-[280px] flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-zinc-800 rounded"></div>
                  <div className="h-4 w-12 bg-zinc-800 rounded"></div>
                </div>
                <div className="space-y-2 flex-1 my-4">
                  <div className="h-3 w-full bg-zinc-800 rounded"></div>
                  <div className="h-3 w-5/6 bg-zinc-800 rounded"></div>
                </div>
                <div className="flex justify-end space-x-2">
                  <div className="h-8 w-20 bg-zinc-800/60 rounded"></div>
                  <div className="h-8 w-24 bg-zinc-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'outreach':
      return (
        <div className="space-y-6 animate-pulse select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div className="space-y-2">
              <div className="h-6 w-52 bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-80 bg-zinc-800/60 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
            {/* Left pane */}
            <div className="lg:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-4 flex flex-col justify-between">
              <div className="h-4 w-24 bg-zinc-800 rounded"></div>
              <div className="space-y-2 flex-1 my-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-zinc-800/40 rounded"></div>
                ))}
              </div>
            </div>

            {/* Right pane */}
            <div className="lg:col-span-8 bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 flex flex-col justify-between">
              <div className="h-5 w-40 bg-zinc-800 rounded border-b border-zinc-800 pb-3 mb-4"></div>
              <div className="flex-1 space-y-4">
                <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                <div className="h-2 w-full bg-zinc-800/40 rounded"></div>
                <div className="h-2 w-full bg-zinc-800/40 rounded"></div>
                <div className="h-2 w-5/6 bg-zinc-800/40 rounded"></div>
              </div>
              <div className="h-10 bg-zinc-800/60 rounded-[8px] mt-4"></div>
            </div>
          </div>
        </div>
      );

    case 'orchestration':
      return (
        <div className="space-y-6 animate-pulse select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div className="space-y-2">
              <div className="h-6 w-52 bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-80 bg-zinc-800/60 rounded"></div>
            </div>
          </div>

          {/* Diagram Frame skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-6 h-[500px] flex items-center justify-center">
              <div className="h-40 w-40 bg-zinc-800 rounded-full"></div>
            </div>
            <div className="lg:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-[10px] p-5 h-[500px]">
              <div className="h-4 w-24 bg-zinc-800 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-zinc-800/40 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-20 text-zinc-500 font-mono animate-pulse">
          Syncing microservice schema...
        </div>
      );
  }
}
