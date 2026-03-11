import React, { useState } from 'react'
import CheckedTask from './component/CheckedTask'
import TaskListAssign from './component/TaskList'
import Request from './component/Request'
import EventManager from './component/EventManager'
import Target from './component/Target'
import Support from './component/Support'
import Cautions from './Cautions'
import TaskLevelList from './component/TaskLevelList'
import Attendance from './attendance'

type TabId = 'list' | 'check' | 'request' | 'event' | 'support' | "caution" | "checkAttendance"

function TaskManager() {
  const [activeTab, setActiveTab] = useState<TabId>('list')
  const [requestSubTab, setRequestSubTab] = useState<'request' | 'target'>(
    'request'
  )
  const [listSubTab, setListSubTab] = useState<'main' | 'sub'>(
    'main'
  )
  const tabs = [
    {
      id: 'list',
      label: 'Công việc',
      shortLabel: 'Công việc',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        </svg>
      ),
    },
    {
      id: 'check',
      label: 'Duyệt nhiệm vụ',
      shortLabel: 'Duyệt',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'checkAttendance',
      label: 'Duyệt đơn từ',
      shortLabel: 'Duyệt',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'request',
      label: 'Sáng kiến & phát triển',
      shortLabel: 'Sáng kiến',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            d="M7 8h10M7 12h4" />
        </svg>
      ),
    },
    {
      id: 'event',
      label: 'Sự kiện nội bộ',
      shortLabel: 'Sự kiện',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'support',
      label: 'Hỗ trợ & phối hợp',
      shortLabel: 'Hỗ trợ',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0" />
        </svg>
      ),
    },
    {
      id: 'caution',
      label: 'Nhắc nhở',
      shortLabel: 'Nhắc nhở',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0" />
        </svg>
      ),
    },
  ] 

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* ================= TAB NAV ================= */}
        <div className="bg-slate-800 rounded-lg p-1">
          <div
            className="flex  gap-1 overflow-x-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 #1e293b',
            }}
          >
            <style>{`
              .tab-scroll::-webkit-scrollbar {
                height: 3px;
              }
              .tab-scroll::-webkit-scrollbar-track {
                background: #1e293b;
                border-radius: 999px;
                margin: 0 4px;
              }
              .tab-scroll::-webkit-scrollbar-thumb {
                background: linear-gradient(90deg, #3b82f6, #6366f1);
                border-radius: 999px;
              }
              .tab-scroll::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(90deg, #60a5fa, #818cf8);
              }
            `}</style>

            <div className="tab-scroll flex justify-between gap-1 overflow-x-auto pb-1 w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 py-3 px-4 rounded-lg font-semibold transition text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========== SUB TAB (REQUEST) ========== */}
        {activeTab === 'request' && (
          <div className="bg-slate-800 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setRequestSubTab('request')}
              className={`flex-1 py-2 rounded-lg font-semibold
                ${requestSubTab === 'request'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
                }`}
            >
              Sáng kiến
            </button>
            <button
              onClick={() => setRequestSubTab('target')}
              className={`flex-1 py-2 rounded-lg font-semibold
                ${requestSubTab === 'target'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
                }`}
            >
              Phát triển
            </button>
          </div>
        )}
        {activeTab === 'list' && (
          <div className="bg-slate-800 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setListSubTab('main')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm
                ${listSubTab === 'main'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
                }`}
            >
              Công việc đã giao
            </button>
            <button
              onClick={() => setListSubTab('sub')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm
                ${listSubTab === 'sub'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
                }`}
            >
              Quản lý công việc
            </button>
          </div>
        )}

        {activeTab === "checkAttendance" && (
          <Attendance />
        )}
        {/* ================= CONTENT ================= */}
        <div className="rounded-lg">
          {activeTab === 'list' && (
            <>
              {listSubTab === "main" && <TaskListAssign />}
              {listSubTab === "sub" && <TaskLevelList />}

            </>
          )}
          {activeTab === 'check' && <CheckedTask />}
          {activeTab === 'request' && (
            <>
              {requestSubTab === 'request' && <Request />}
              {requestSubTab === 'target' && <Target />}
            </>
          )}
          {activeTab === 'event' && <EventManager />}
          {activeTab === 'support' && <Support />}
          {activeTab === 'caution' && <Cautions />}

          
        </div>
      </div>
    </div>
  )
}

export default TaskManager