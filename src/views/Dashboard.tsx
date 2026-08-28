import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Employee } from '../types';
import { calculateMilestones, MilestoneResult } from '../utils/milestones';
import { Cake, Briefcase, Calendar, ChevronRight, TrendingUp, Users, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<MilestoneResult[]>([]);
  const [stats, setStats] = useState({ totalEmployees: 0, activeAlerts: 0 });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const q = query(collection(db, 'employees'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
        
        const calculated = calculateMilestones(employees, 30); // Next 30 days
        setMilestones(calculated);
        setStats({
          totalEmployees: employees.length,
          activeAlerts: employees.filter(e => e.status === 'active').length
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
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const todayMilestones = milestones.filter(m => m.isToday);
  const upcomingMilestones = milestones.filter(m => !m.isToday);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-zinc-400">Welcome back! Here's what's happening with your team milestones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          icon={Users} 
          trend="+2 this month"
          color="from-corp-blue to-blue-600 dark:from-gold-600 dark:to-gold-500" 
        />
        <StatCard 
          title="Upcoming Milestones" 
          value={milestones.length} 
          icon={Calendar} 
          trend="Next 30 days"
          color="from-indigo-500 to-purple-600 dark:from-purple-600 dark:to-purple-500" 
        />
        <StatCard 
          title="Active Alerts" 
          value={stats.activeAlerts} 
          icon={Bell} 
          trend="Monitoring active"
          color="from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-emerald-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Milestones */}
        <section className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              Happening Today
            </h2>
            <span className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-full border border-red-500/20">
              {todayMilestones.length} Events
            </span>
          </div>
          <div className="p-6 space-y-4">
            {todayMilestones.length > 0 ? (
              todayMilestones.map((milestone, idx) => (
                <div key={idx}>
                  <MilestoneItem milestone={milestone} />
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-400 dark:text-zinc-500 text-sm">No milestones for today.</p>
            )}
          </div>
        </section>

        {/* Upcoming Milestones */}
        <section className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Upcoming (Next 30 Days)</h2>
            <Link to="/employees" className="text-sm font-semibold text-highlight hover:opacity-80 transition-opacity">
              View All
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {upcomingMilestones.length > 0 ? (
              upcomingMilestones.map((milestone, idx) => (
                <div key={idx}>
                  <MilestoneItem milestone={milestone} />
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-400 dark:text-zinc-500 text-sm">No upcoming milestones.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
      {/* Decorative gradient glow in background */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${color} opacity-10 dark:opacity-5 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-zinc-100">{value}</h3>
        </div>
        <div className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white dark:text-black" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 relative z-10">
        <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        <span className="text-sm text-slate-500 dark:text-zinc-400 font-medium">{trend}</span>
      </div>
    </div>
  );
}

function MilestoneItem({ milestone }: { milestone: MilestoneResult }) {
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
          {milestone.employee.firstName} {milestone.employee.lastName}
        </h4>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          {milestone.type === 'BIRTHDAY' ? 'Birthday' : `${milestone.years}yr Anniversary`}
          {milestone.isToday ? ' • Today' : ` • In ${milestone.daysUntil} days`}
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
