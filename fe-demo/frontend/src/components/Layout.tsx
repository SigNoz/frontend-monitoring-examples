import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Plus, Home } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { logInfo } from '../otel/logger_utils';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSettingsOpen = () => {
    logInfo('User opened settings modal');
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    logInfo('User closed settings modal');
    setIsSettingsOpen(false);
  };

  const handleNavigation = (path: string, label: string) => {
    logInfo('User navigated via layout', {
      path,
      label,
      currentLocation: location.pathname,
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo and Navigation */}
            <div className='flex items-center space-x-8'>
              {/* Signoz Logo */}
              <div className='flex items-center'>
                <img
                  src='/signoz.svg'
                  alt='Signoz Logo'
                  className='h-8 w-auto'
                />
              </div>

              {/* Navigation Links */}
              <nav className='hidden md:flex space-x-1'>
                <Link
                  to='/'
                  onClick={() => handleNavigation('/', 'Home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                  <Home className='w-4 h-4 inline mr-2' />
                  Home
                </Link>
                <Link
                  to='/expense/new'
                  onClick={() =>
                    handleNavigation('/expense/new', 'Add Expense')
                  }
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/expense')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                  <Plus className='w-4 h-4 inline mr-2' />
                  Add Expense
                </Link>
              </nav>
            </div>

            {/* Right side - Settings */}
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleSettingsOpen}
                className='p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                title='Settings'>
                <Settings className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className='md:hidden bg-white border-b border-gray-200'>
        <div className='px-4 py-3'>
          <nav className='flex space-x-4'>
            <Link
              to='/'
              onClick={() => handleNavigation('/', 'Home (Mobile)')}
              className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
              <Home className='w-4 h-4 inline mr-2' />
              Home
            </Link>
            <Link
              to='/expense/new'
              onClick={() =>
                handleNavigation('/expense/new', 'Add Expense (Mobile)')
              }
              className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/expense')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
              <Plus className='w-4 h-4 inline mr-2' />
              Add
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {children}
      </main>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={handleSettingsClose} />
    </div>
  );
}
