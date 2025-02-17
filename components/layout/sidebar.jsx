'use client';

import { useState } from 'react';
import Link from 'next/link';

const HomeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const AssistantIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
  </svg>
);

const ReportIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <path d="M14 2v6h6"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

const CodeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const DocsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export function Sidebar({ isOpen, onToggle }) {
  const [isPersonalOpen, setIsPersonalOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
      >
        <MenuIcon />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 
        min-h-screen bg-white border-r border-gray-200 
        flex flex-col transition-all duration-200 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo and Toggle Button Container */}
        <div className="p-6 flex items-center justify-between">
          <span className={`text-xl font-bold text-gray-900 transition-opacity duration-200 
            ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
            Vroom AI
          </span>
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-transform duration-200"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
        </div>

        {/* Rest of the content - Only show when open */}
        <div className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
          {/* Personal Dropdown */}
          <div className="px-3 mb-6">
            <button 
              onClick={() => setIsPersonalOpen(!isPersonalOpen)}
              className="w-full px-3 py-2 flex items-center justify-between text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span>Personal</span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3">
            <Link href="/overview" className="flex items-center gap-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg mb-1">
              <HomeIcon />
              <span>Overview</span>
            </Link>

            <Link href="/account" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-1">
              <UserIcon />
              <span>My Account</span>
            </Link>

            <Link href="/assistant" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-1">
              <AssistantIcon />
              <span>Research Assistant</span>
            </Link>

            <Link href="/reports" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-1">
              <ReportIcon />
              <span>Research Reports</span>
            </Link>

            <Link href="/playground" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-1">
              <CodeIcon />
              <span>API Playground</span>
            </Link>

            <Link href="/docs" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <DocsIcon />
              <span>Documentation</span>
              <svg className="w-4 h-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </Link>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">U</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">User Name</div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Icon-only navigation for collapsed state */}
        <div className={`hidden lg:flex flex-col px-3 gap-4 ${!isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <Link href="/overview" className="p-2 text-blue-600 bg-blue-50 rounded-lg">
            <HomeIcon />
          </Link>
          <Link href="/account" className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <UserIcon />
          </Link>
          {/* ... add other icon-only links ... */}
        </div>
      </aside>
    </>
  );
} 