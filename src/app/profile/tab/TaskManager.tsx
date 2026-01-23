import React, { useState } from 'react'
import CheckedTask from './component/CheckedTask'
import TaskListAssign from './component/TaskList';

function TaskManager() {
  const [activeTab, setActiveTab] = useState<'list' | 'check'>('list');

  return (
    <div className="min-h-screen bg-slate-900 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Tab Navigation */}
        <div className="bg-slate-800 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Danh sách công việc được giao</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('check')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'check'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Duyệt nhiệm vụ</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className=" rounded-lg">
          {activeTab === 'list' ? (
            <TaskListAssign />
          ) : (
            <CheckedTask />
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskManager