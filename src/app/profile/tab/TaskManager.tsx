import React, { useState } from 'react'
import CheckedTask from './component/CheckedTask'
import TaskListAssign from './component/TaskList'
import Request from './component/Request'
import EventManager from './component/EventManager'
import Target from './component/Target'
import Support from './component/Support'
import Cautions from './Cautions'

type TabId = 'list' | 'check' | 'request' | 'event' | 'support' | "caution"

function TaskManager() {
  const [activeTab, setActiveTab] = useState<TabId>('list')
  const [requestSubTab, setRequestSubTab] = useState<'request' | 'target'>(
    'request'
  )

  const tabs = [
    {
      id: 'list',
      label: 'Công việc đã giao',
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

          {/* MOBILE: 3 trên - 2 dưới */}
          <div className="grid grid-cols-3 gap-1 sm:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 rounded-lg text-xs font-semibold transition
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700'
                  }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {/* {tab.icon} */}
                  <span className="text-center leading-tight">
                    {tab.shortLabel}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* TABLET */}
          <div className="hidden sm:grid md:hidden grid-cols-5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 rounded-lg text-sm font-semibold transition
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700'
                  }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {/* {tab.icon} */}
                  <span>{tab.shortLabel}</span>
                </div>
              </button>
            ))}
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 rounded-lg font-semibold transition
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {/* {tab.icon} */}
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
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

        {/* ================= CONTENT ================= */}
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
          {activeTab === 'support' && <Support />}
          {activeTab === 'caution' && <Cautions />}

          
        </div>
      </div>
    </div>
  )
}

export default TaskManager
