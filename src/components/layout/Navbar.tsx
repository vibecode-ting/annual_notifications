import { User, LogOut, Users, LayoutDashboard, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Employees', href: '/employees', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 glass-panel border-r-0 border-r-white/20 dark:border-r-zinc-800/40 p-6 flex flex-col z-40">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-gradient-to-br from-corp-blue to-indigo-700 dark:from-gold-600 dark:to-gold-500 rounded-lg shadow-lg">
          <Bell className="w-6 h-6 text-white dark:text-black" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Milestone</h1>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                isActive 
                  ? "bg-corp-blue/10 text-corp-blue dark:bg-gold-500/15 dark:text-gold-400 font-bold" 
                  : "text-slate-600 hover:bg-slate-500/10 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="pt-6 border-t border-slate-200/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-zinc-200 truncate">
              {user.displayName || user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
