import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Employee } from '../types';
import { calculateMilestones, MilestoneResult } from '../utils/milestones';
import { Cake, Briefcase, Calendar, ChevronRight, TrendingUp, Users, Bell, X, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [milestones, setMilestones] = useState<MilestoneResult[]>([]);
  const [stats, setStats] = useState({ totalEmployees: 0, activeAlerts: 0 });
  const [expandedStat, setExpandedStat] = useState<'employees' | 'milestones' | 'alerts' | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'employees'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedEmployees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
        
        setEmployees(fetchedEmployees);
        const calculated = calculateMilestones(fetchedEmployees, 30); // Next 30 days
        setMilestones(calculated);
        setStats({
          totalEmployees: fetchedEmployees.length,
          activeAlerts: fetchedEmployees.filter(e => e.status === 'active').length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-corp-blue dark:border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const todayMilestones = milestones.filter(m => m.isToday);
  const upcomingMilestones = milestones.filter(m => !m.isToday);
  
  const deptCounts = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Other';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const deptSummary = Object.entries(deptCounts).map(([dept, count]) => `${dept}: ${count}`).join(', ') || t('Click to view details');

  // Chart Data Preparation
  const chartData = Object.entries(deptCounts).map(([name, count]) => ({ name, count }));
  
  // Fake timeline data for Grafana-style area chart
  const timelineData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString(undefined, { weekday: 'short' }),
      birthdays: Math.floor(Math.random() * 5),
      anniversaries: Math.floor(Math.random() * 3)
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{t('Dashboard Overview')}</h1>
        <p className="text-slate-500 dark:text-zinc-400">{t("Welcome back! Here's what's happening with your team milestones.")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={t("Total Employees")} 
          value={stats.totalEmployees} 
          icon={Users} 
          trend={deptSummary}
          color="from-corp-blue to-blue-600 dark:from-gold-600 dark:to-gold-500"
          onClick={() => setExpandedStat('employees')}
        />
        <StatCard 
          title={t("Upcoming Milestones")} 
          value={milestones.length} 
          icon={Calendar} 
          trend={t("This month")}
          color="from-indigo-500 to-purple-600 dark:from-purple-600 dark:to-purple-500"
          onClick={() => setExpandedStat('milestones')}
        />
        <StatCard 
          title={t("Active Alerts")} 
          value={stats.activeAlerts} 
          icon={Bell} 
          trend={t("Click to view details")}
          color="from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-emerald-500"
          onClick={() => setExpandedStat('alerts')}
        />
      </div>

      {/* Analytics Charts (Metabase/Grafana style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-corp-blue dark:text-gold-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{t('7-Day Activity History')}</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorBday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnniv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="birthdays" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorBday)" name={t("Birthdays")} />
                <Area type="monotone" dataKey="anniversaries" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorAnniv)" name={t("Anniversaries")} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{t('Headcount by Department')}</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name={t("Employees")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Milestones */}
        <section className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              {t('Happening Today')}
            </h2>
            <span className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-full border border-red-500/20">
              {todayMilestones.length} {t('Events')}
            </span>
          </div>
          <div className="p-6 space-y-4">
            {todayMilestones.length > 0 ? (
              todayMilestones.map((milestone, idx) => (
                <div key={idx}>
                  <MilestoneItem milestone={milestone} t={t} />
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-400 dark:text-zinc-500 text-sm">{t('No milestones for today.')}</p>
            )}
          </div>
        </section>

        {/* Upcoming Milestones */}
        <section className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{t('Upcoming (Next 30 Days)')}</h2>
            <Link to="/employees" className="text-sm font-semibold text-highlight hover:opacity-80 transition-opacity">
              {t('View All')}
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {upcomingMilestones.length > 0 ? (
              upcomingMilestones.map((milestone, idx) => (
                <div key={idx}>
                  <MilestoneItem milestone={milestone} t={t} />
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-400 dark:text-zinc-500 text-sm">{t('No upcoming milestones.')}</p>
            )}
          </div>
        </section>
      </div>

      {/* Expanded Stats Modals */}
      {expandedStat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setExpandedStat(null)}></div>
          <div className="glass-panel relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-zinc-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {expandedStat === 'employees' && t('Total Employees')}
                {expandedStat === 'milestones' && t('Upcoming Milestones')}
                {expandedStat === 'alerts' && t('Active Alerts')}
              </h3>
              <button onClick={() => setExpandedStat(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-500 dark:text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {expandedStat === 'employees' && (
                <div className="space-y-4">
                  {employees.map(emp => (
                    <div key={emp.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/50">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-zinc-100">{emp.name}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{emp.department} • {emp.email}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">{t('Joined')}: {emp.joinedDate} • {t('DOB')}: {emp.dob}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{t('ID')}: {emp.employeeId}</span>
                    </div>
                  ))}
                  {employees.length === 0 && <p className="text-sm text-slate-500 text-center py-4">{t('No employees found.')}</p>}
                </div>
              )}
              {expandedStat === 'milestones' && (
                <div className="space-y-4">
                  {milestones.map((milestone, idx) => (
                    <div key={idx}>
                      <MilestoneItem milestone={milestone} t={t} />
                    </div>
                  ))}
                  {milestones.length === 0 && <p className="text-sm text-slate-500 text-center py-4">{t('No upcoming milestones.')}</p>}
                </div>
              )}
              {expandedStat === 'alerts' && (
                <div className="space-y-4">
                  {employees.filter(e => e.status === 'active').map(emp => (
                    <div key={emp.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/50">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-zinc-100">{emp.name}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{t("Alerts active for this employee's milestones.")}</p>
                      </div>
                      <Bell className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                  {employees.filter(e => e.status === 'active').length === 0 && <p className="text-sm text-slate-500 text-center py-4">{t('No active alerts.')}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color, onClick }: any) {
  return (
    <div 
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Decorative gradient glow in background */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${color} opacity-10 dark:opacity-5 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 group-hover:text-corp-blue dark:group-hover:text-gold-400 transition-colors">{value}</h3>
        </div>
        <div className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white dark:text-black" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span className="text-sm text-slate-500 dark:text-zinc-400 font-medium truncate max-w-[200px]">{trend}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-corp-blue dark:group-hover:text-gold-500 transition-colors shrink-0" />
      </div>
    </div>
  );
}

function MilestoneItem({ milestone, t }: { milestone: MilestoneResult, t: any }) {
  const Icon = milestone.type === 'BIRTHDAY' ? Cake : Briefcase;
  const isBirthday = milestone.type === 'BIRTHDAY';
  
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 dark:hover:bg-zinc-800/40 transition-colors group border border-transparent hover:border-white/50 dark:hover:border-zinc-700/50">
      <div className={cn(
        "p-2.5 rounded-xl shadow-sm",
        isBirthday 
          ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20" 
          : "bg-corp-blue/10 text-corp-blue dark:bg-gold-500/10 dark:text-gold-500 border border-corp-blue/20 dark:border-gold-500/20"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate group-hover:text-corp-blue dark:group-hover:text-gold-400 transition-colors">
          {milestone.employee.name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          {milestone.type === 'BIRTHDAY' ? t('Birthday') : `${milestone.years}${t('yr Work-Anniversary')}`}
          {milestone.isToday ? ` • ${t('Today')}` : ` • ${t('In')} ${milestone.daysUntil} ${t('days')}`}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900 dark:text-zinc-300">
          {new Date(isBirthday ? milestone.employee.dob : milestone.employee.joinedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-corp-blue dark:group-hover:text-gold-400 transition-colors" />
    </div>
  );
}
