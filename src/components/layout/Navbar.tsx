import { User, LogOut, Users, LayoutDashboard, Settings, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Navbar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const { user, appUser, signOut } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Employees', href: '/employees', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
  
  if (appUser?.role === 'admin') {
    navItems.push({ name: 'User Management', href: '/admin/users', icon: Shield });
  }

  const planName = appUser?.role === 'admin' ? 'Mod Admin' : appUser?.role === 'pro' ? 'Pro Subscriptions' : 'Free Plan';

  return (
    <nav 
      className={cn(
        "fixed left-0 top-0 h-screen glass-panel shadow-[4px_0_24px_-4px_rgba(168,85,247,0.3)] dark:shadow-[4px_0_24px_-4px_rgba(168,85,247,0.2)] border-r border-r-purple-500/20 dark:border-r-purple-500/30 p-4 flex flex-col z-50 transition-all duration-300",
        isOpen ? "w-72" : "w-20"
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={cn("flex items-center gap-3 mb-10 transition-all", isOpen ? "px-2" : "justify-center")}>
        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.5)] shrink-0">
          <Bell className="w-6 h-6 text-white" />
        </div>
        {isOpen && <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight whitespace-nowrap opacity-100 animate-in fade-in duration-300">Milestone</h1>}
      </div>

      <div className="flex-1 space-y-1 overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-all text-sm font-medium",
                isOpen ? "px-3 py-2.5" : "justify-center py-2.5",
                isActive 
                  ? "bg-corp-blue/10 text-corp-blue dark:bg-gold-500/15 dark:text-gold-400 font-bold" 
                  : "text-slate-600 hover:bg-slate-500/10 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
              )}
              title={!isOpen ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && <span className="whitespace-nowrap opacity-100 animate-in fade-in duration-300">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="pt-6 border-t border-purple-500/20 dark:border-purple-500/20 overflow-hidden">
        <div className={cn("flex items-center gap-3 mb-2 transition-all", isOpen ? "px-3 py-4" : "justify-center py-4")}>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 shrink-0">
            <User className="w-5 h-5 shrink-0" />
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0 opacity-100 animate-in fade-in duration-300 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-zinc-200 truncate max-w-[100px]">
                  {user.displayName || user.email}
                </p>
                <p className={cn(
                  "text-[10px] font-bold mt-0.5 uppercase tracking-wider",
                  appUser?.role === 'pro' ? "text-corp-blue dark:text-gold-500" : 
                  appUser?.role === 'admin' ? "text-emerald-600 dark:text-emerald-400" : 
                  "text-slate-500 dark:text-zinc-500"
                )}>
                  {planName}
                </p>
              </div>
              {appUser?.role === 'user' && (
                <Link to="/admin/users" className="shrink-0 px-2.5 py-1 bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-bold rounded-md shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-colors uppercase tracking-wider">
                  Upgrade
                </Link>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors",
            isOpen ? "px-3 py-2.5" : "justify-center py-2.5"
          )}
          title={!isOpen ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span className="whitespace-nowrap opacity-100 animate-in fade-in duration-300">Sign Out</span>}
        </button>
      </div>
    </nav>
  );
}
