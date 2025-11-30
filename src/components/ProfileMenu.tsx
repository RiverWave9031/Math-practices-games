import React, { useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const ProfileMenu = ({ isOpen, onClose, userEmail, onOpenSettings, onLogout }: ProfileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute top-14 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl overflow-hidden z-50 min-w-[280px]"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {userEmail}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Signed in
            </p>
          </div>
        </div>
      </div>

      <div className="py-2">
        <button
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Settings
          </span>
        </button>

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
        >
          <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
