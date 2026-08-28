import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { AlertSettings } from '../types';
import { Mail, MessageSquare, Send, Globe, Save, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<AlertSettings>({
    userId: '',
    templates: {
      birthday: 'Happy Birthday {{employee_name}}! Wishing you a fantastic day.',
      anniversary: 'Congratulations {{employee_name}} on your {{years_of_service}} year work anniversary!'
    }
  });

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AlertSettings);
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', user.uid), { ...settings, userId: user.uid });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Notification Settings</h1>
        <p className="text-slate-500 dark:text-zinc-400">Configure your alert channels and message templates.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Email SMTP */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Email (SMTP)</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Send milestone alerts via email.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.smtp?.enabled} 
                onChange={(e) => setSettings({ ...settings, smtp: { ...(settings.smtp || { host: '', port: 587, user: '' }), enabled: e.target.checked }})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-corp-blue dark:peer-checked:bg-gold-500"></div>
            </label>
          </div>
          {settings.smtp?.enabled && (
            <div className="p-6 grid grid-cols-2 gap-4 bg-slate-50/30 dark:bg-zinc-900/30">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">SMTP Host</label>
                <input 
                  value={settings.smtp.host}
                  onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp!, host: e.target.value }})}
                  placeholder="smtp.sendgrid.net" 
                  className="glass-input" 
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">SMTP Port</label>
                <input 
                  type="number"
                  value={settings.smtp.port}
                  onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp!, port: parseInt(e.target.value) }})}
                  className="glass-input" 
                />
              </div>
            </div>
          )}
        </div>

        {/* MS Teams */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Microsoft Teams</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Post adaptive cards to a Teams channel.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.teams?.enabled} 
                onChange={(e) => setSettings({ ...settings, teams: { ...(settings.teams || { webhookUrl: '' }), enabled: e.target.checked }})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-corp-blue dark:peer-checked:bg-gold-500"></div>
            </label>
          </div>
          {settings.teams?.enabled && (
            <div className="p-6 bg-slate-50/30 dark:bg-zinc-900/30">
              <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Incoming Webhook URL</label>
              <input 
                value={settings.teams.webhookUrl}
                onChange={(e) => setSettings({ ...settings, teams: { ...settings.teams!, webhookUrl: e.target.value }})}
                placeholder="https://outlook.office.com/webhook/..." 
                className="glass-input" 
              />
            </div>
          )}
        </div>

        {/* Telegram */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Telegram Bot</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Send Markdown notifications via Telegram.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.telegram?.enabled} 
                onChange={(e) => setSettings({ ...settings, telegram: { ...(settings.telegram || { botToken: '', chatId: '' }), enabled: e.target.checked }})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-corp-blue dark:peer-checked:bg-gold-500"></div>
            </label>
          </div>
          {settings.telegram?.enabled && (
            <div className="p-6 grid grid-cols-2 gap-4 bg-slate-50/30 dark:bg-zinc-900/30">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Bot Token</label>
                <input 
                  value={settings.telegram.botToken}
                  onChange={(e) => setSettings({ ...settings, telegram: { ...settings.telegram!, botToken: e.target.value }})}
                  className="glass-input" 
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Chat ID</label>
                <input 
                  value={settings.telegram.chatId}
                  onChange={(e) => setSettings({ ...settings, telegram: { ...settings.telegram!, chatId: e.target.value }})}
                  className="glass-input" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Template Builder */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Message Templates</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Customize how your alerts look.</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Birthday Message</label>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-zinc-300 font-mono">{"{{employee_name}}"}</span>
                </div>
              </div>
              <textarea 
                rows={3}
                value={settings.templates.birthday}
                onChange={(e) => setSettings({ ...settings, templates: { ...settings.templates, birthday: e.target.value }})}
                className="glass-input"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Anniversary Message</label>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-zinc-300 font-mono">{"{{years_of_service}}"}</span>
                </div>
              </div>
              <textarea 
                rows={3}
                value={settings.templates.anniversary}
                onChange={(e) => setSettings({ ...settings, templates: { ...settings.templates, anniversary: e.target.value }})}
                className="glass-input"
              />
            </div>
            <div className="p-4 bg-corp-blue/10 dark:bg-gold-500/10 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-corp-blue dark:text-gold-500 shrink-0" />
              <p className="text-xs text-corp-blue dark:text-gold-500/80 leading-relaxed">
                Available variables: <code className="font-bold text-corp-blue dark:text-gold-400">{"{{employee_name}}"}</code>, 
                <code className="font-bold text-corp-blue dark:text-gold-400">{"{{department}}"}</code>, 
                <code className="font-bold text-corp-blue dark:text-gold-400">{"{{job_title}}"}</code>, 
                <code className="font-bold text-corp-blue dark:text-gold-400">{"{{years_of_service}}"}</code> (Anniversaries only).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <button 
            type="submit"
            disabled={saving}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg",
              saved ? "bg-emerald-500 text-white" : "btn-primary hover:-translate-y-0.5"
            )}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Settings Saved
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
