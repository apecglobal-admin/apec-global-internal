import React, { useState } from 'react'
import CheckedTask from './component/CheckedTask'
import TaskListAssign from './component/TaskList';
import Request from './component/Request';
import EventManager from './component/EventManager';
import Target from './component/Target';

function TaskManager() { 
  const [activeTab, setActiveTab] = useState<'list' | 'check' | 'request' | 'event'>('list');
  const [requestSubTab, setRequestSubTab] = useState<'request' | 'target'>('request');

  const tabs = [
    {
      id: 'list',
      label: 'Công việc đã giao',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      shortLabel: 'Công việc'
    },
    {
      id: 'check',
      label: 'Duyệt nhiệm vụ',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      shortLabel: 'Duyệt'
    },
    {
      id: 'request',
      label: 'Sáng kiến & phát triển',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      shortLabel: 'Sáng kiến & phát triển'
    },
    {
      id: 'event',
      label: 'Sự kiện nội bộ',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      shortLabel: 'Sự kiện'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Tab Navigation - Responsive Grid/Flex Layout */}
        <div className="bg-slate-800 rounded-lg p-1">
          {/* Mobile: 2x2 Grid */}
          <div className="grid grid-cols-2 gap-1 sm:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2 py-3 rounded-lg font-semibold transition-all duration-200 text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  {tab.icon}
                  <span className="text-center leading-tight">{tab.shortLabel}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tablet: Horizontal with short labels */}
          <div className="hidden sm:grid md:hidden grid-cols-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2 py-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  {tab.icon}
                  <span className="text-center text-xs leading-tight">{tab.shortLabel}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Desktop: Full labels */}
          <div className="hidden md:flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-base ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab.icon}
                  <span className="whitespace-nowrap">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-tabs for Request section */}
        {activeTab === 'request' && (
          <div className="bg-slate-800 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setRequestSubTab('request')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                requestSubTab === 'request'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Sáng kiến</span>
              </div>
            </button>
            
            <button
              onClick={() => setRequestSubTab('target')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                requestSubTab === 'target'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Mục tiêu</span>
              </div>
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="rounded-lg">
          {activeTab === 'list' && <TaskListAssign />}  
          {activeTab === 'check' && <CheckedTask />}
          {activeTab === 'request' && (
            <>
              {requestSubTab === 'request' && <Request />}
              {requestSubTab === 'target' && <Target />}
            </>
          )}
          {activeTab === 'event' && <EventManager />}
        </div>
      </div>
    </div>
  )
}

export default TaskManager