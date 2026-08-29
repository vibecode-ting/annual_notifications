import { User, LogOut, Users, LayoutDashboard, Settings, Bell, Shield, Globe2, Zap, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export function Navbar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const { user, appUser, signOut } = useAuth();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  if (!user) return null;

  const navItems = [
    { name: t('Dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('Employees'), href: '/employees', icon: Users },
    { name: t('Settings'), href: '/settings', icon: Settings },
  ];
  
  if (appUser?.role === 'admin') {
    navItems.push({ name: 'User Management', href: '/admin/users', icon: Shield });
  }

  const planName = appUser?.role === 'admin' ? 'Mod Admin' : appUser?.role === 'pro' ? 'Pro Subscriptions' : 'Free Plan';

  const toggleLanguage = () => {
    const langs = ['en', 'mm', 'zh', 'vn'];
    const currentLang = i18n.language || 'en';
    const currentIndex = langs.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const getFlag = (lang: string) => {
    switch (lang) {
      case 'mm': return '🇲🇲';
      case 'zh': return '🇹🇼';
      case 'vn': return '🇻🇳';
      case 'en': 
      default: return '🇺🇸';
    }
  };

  return (
    <nav 
      className={cn(
        "fixed left-0 top-0 h-screen glass-panel shadow-[4px_0_24px_-4px_rgba(168,85,247,0.3)] dark:shadow-[4px_0_24px_-4px_rgba(168,85,247,0.2)] border-r border-r-purple-500/20 dark:border-r-purple-500/30 p-4 flex flex-col z-50 transition-all duration-300",
        isOpen ? "w-72" : "w-20"
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={cn("flex items-center mb-10 transition-all", isOpen ? "justify-center gap-4 w-full" : "justify-center gap-0 w-full")}>
        <img src="/logo.svg" alt="Milestone Logo" className={cn("rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0 transition-all", isOpen ? "w-12 h-12" : "w-8 h-8")} />
        {isOpen && <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight whitespace-nowrap opacity-100 animate-in fade-in duration-300">Milestone</h1>}
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
        <div className={cn("flex flex-col gap-3 mb-2 transition-all", isOpen ? "px-3 py-4" : "px-0 py-4 items-center")}>
          <div className={cn("flex items-center gap-3", isOpen ? "w-full" : "justify-center")}>
            <div className={cn("flex items-center justify-center bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 shrink-0", isOpen ? "w-10 h-10 rounded-full" : "w-8 h-8 rounded-full")}>
              <User className="w-5 h-5 shrink-0" />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0 opacity-100 animate-in fade-in duration-300">
                <p className="text-sm font-medium text-slate-900 dark:text-zinc-200 truncate">
                  {user.displayName || user.email}
                </p>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                  appUser?.role === 'pro' ? "text-corp-blue dark:text-gold-500" : 
                  appUser?.role === 'admin' ? "text-emerald-600 dark:text-emerald-400" : 
                  "text-slate-500 dark:text-zinc-500"
                )}>
                  {planName}
                </p>
              </div>
            )}
          </div>
          
          <div className={cn("flex flex-col gap-2 mt-2", isOpen ? "w-full" : "items-center")}>
            <button 
              onClick={toggleTheme} 
              className={cn(
                "flex items-center justify-center transition-colors bg-slate-100 dark:bg-zinc-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700/50 text-slate-700 dark:text-zinc-300",
                isOpen ? "w-full py-2 px-3 rounded-lg gap-2" : "w-8 h-8 rounded-full"
              )}
              title={!isOpen ? (isDark ? "Light Mode" : "Dark Mode") : undefined}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isOpen && <span className="text-[10px] font-bold uppercase tracking-wider">{isDark ? "Light Mode" : "Dark Mode"}</span>}
            </button>

            <button 
              onClick={toggleLanguage} 
              className={cn(
                "flex items-center justify-center transition-colors bg-slate-100 dark:bg-zinc-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700/50 text-slate-700 dark:text-zinc-300",
                isOpen ? "w-full py-2 px-3 rounded-lg gap-2" : "w-8 h-8 rounded-full"
              )}
              title={!isOpen ? "Switch Language" : undefined}
            >
              <span className="text-base leading-none">{getFlag(i18n.language || 'en')}</span>
              {isOpen && <span className="text-[10px] font-bold uppercase tracking-wider">{i18n.language || 'en'}</span>}
            </button>
            
            {appUser?.role === 'user' && (
              <Link 
                to="/pricing" 
                className={cn(
                  "flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white transition-all shadow-md",
                  isOpen ? "w-full py-2 px-3 rounded-lg gap-2" : "w-8 h-8 rounded-full shrink-0"
                )}
                title={!isOpen ? t('Upgrade to PRO') : undefined}
              >
                <Zap className={cn("shrink-0 text-gold-300", isOpen ? "w-4 h-4" : "w-4 h-4")} />
                {isOpen && <span className="text-[10px] font-bold uppercase tracking-wider">{t('Upgrade to PRO')}</span>}
              </Link>
            )}
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors mt-2",
            isOpen ? "px-3 py-2.5" : "justify-center py-2.5"
          )}
          title={!isOpen ? t('Sign Out') : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span className="whitespace-nowrap opacity-100 animate-in fade-in duration-300">{t('Sign Out')}</span>}
        </button>
      </div>
    </nav>
  );
}
