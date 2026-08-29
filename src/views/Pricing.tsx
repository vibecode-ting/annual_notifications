import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Building, Zap, MessageSquare, Headphones, Shield, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Pricing() {
  const [selectedWallet, setSelectedWallet] = useState<'kbz' | 'wave' | 'aya' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const wallets = [
    { id: 'kbz', name: 'KBZ Pay', color: 'bg-blue-500' },
    { id: 'wave', name: 'Wave Pay', color: 'bg-yellow-500' },
    { id: 'aya', name: 'AYA Pay', color: 'bg-red-500' }
  ];

  const handleCheckout = async () => {
    if (!selectedWallet || !selectedPlan || !user) return;
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          role: 'pro'
        });
        setSuccess(true);
      } catch (e) {
        console.error(e);
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-8">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-zinc-100 mb-4">Payment Successful!</h1>
        <p className="text-lg text-slate-500 dark:text-zinc-400 mb-8 max-w-md text-center">
          Welcome to PRO. You now have access to premium card templates and advanced integrations.
        </p>
        <Link to="/settings" className="px-8 py-3 bg-corp-blue text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-all">
          Configure PRO Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
          Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">PRO</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
          Unlock beautiful custom card templates, upload your own logos, and connect to thousands of employees. Select your plan below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pro 6 Month */}
        <div 
          onClick={() => setSelectedPlan('pro_6m')}
          className={cn(
            "glass-panel rounded-3xl p-6 cursor-pointer transition-all border-2 relative",
            selectedPlan === 'pro_6m' ? "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]" : "border-transparent hover:border-purple-500/50"
          )}
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Pro</h3>
          <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-4">6 Months</p>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-extrabold">5,000</span>
            <span className="text-slate-500 font-medium">MMK</span>
          </div>
          <p className="text-xs text-slate-400 mb-6 font-medium">(approx. 1 USDT)</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" /> Up to 1,000 Employees
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" /> Customize Column Data Fields
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" /> Card Templates
            </li>
          </ul>
        </div>

        {/* Pro 12 Month */}
        <div 
          onClick={() => setSelectedPlan('pro_12m')}
          className={cn(
            "glass-panel rounded-3xl p-6 cursor-pointer transition-all border-2 relative",
            selectedPlan === 'pro_12m' ? "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]" : "border-transparent hover:border-purple-500/50"
          )}
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Pro</h3>
          <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-4">12 Months</p>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-extrabold">10,000</span>
            <span className="text-slate-500 font-medium">MMK</span>
          </div>
          <p className="text-xs text-slate-400 mb-6 font-medium">(approx. 2 USDT)</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" /> Up to 1,000 Employees
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" /> Customize Column Data Fields
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" /> Card Templates
            </li>
          </ul>
        </div>

        {/* Pro Plus 6 Month */}
        <div 
          onClick={() => setSelectedPlan('pro_plus_6m')}
          className={cn(
            "glass-panel rounded-3xl p-6 cursor-pointer transition-all border-2 relative",
            selectedPlan === 'pro_plus_6m' ? "border-gold-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]" : "border-transparent hover:border-gold-500/50"
          )}
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Pro Plus</h3>
          <p className="text-xs font-bold text-gold-500 uppercase tracking-wide mb-4">6 Months</p>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-extrabold">10,000</span>
            <span className="text-slate-500 font-medium">MMK</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Zap className="w-5 h-5 text-gold-500 shrink-0" /> Unlimited Employees
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" /> Feature Requests
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Headphones className="w-5 h-5 text-gold-500 shrink-0" /> Customer Support
            </li>
          </ul>
        </div>

        {/* Pro Plus Lifetime - RECOMMENDED */}
        <div 
          onClick={() => setSelectedPlan('pro_plus_life')}
          className={cn(
            "bg-gradient-to-b from-indigo-900 to-purple-900 rounded-3xl p-6 cursor-pointer transition-all border-2 relative shadow-2xl",
            selectedPlan === 'pro_plus_life' ? "border-gold-400 scale-105 z-10" : "border-purple-700/50 hover:border-gold-400/50 scale-100"
          )}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-gold-500 to-yellow-400 rounded-full text-[10px] font-bold text-black uppercase tracking-wider shadow-lg">
            Popular & Recommended
          </div>
          <h3 className="text-xl font-bold text-white">Pro Plus</h3>
          <p className="text-xs font-bold text-gold-400 uppercase tracking-wide mb-4">Lifetime</p>
          <div className="flex items-baseline gap-1 mb-6 text-white">
            <span className="text-3xl font-extrabold">30,000</span>
            <span className="text-purple-300 font-medium">MMK</span>
          </div>
          <ul className="space-y-3 mb-8 text-purple-100">
            <li className="flex items-start gap-2 text-sm">
              <Zap className="w-5 h-5 text-gold-400 shrink-0" /> Unlimited Employees
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Shield className="w-5 h-5 text-gold-400 shrink-0" /> Feature Requests to Dev Team
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Headphones className="w-5 h-5 text-gold-400 shrink-0" /> Priority Customer Support
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Building className="w-5 h-5 text-gold-400 shrink-0" /> Custom Integrations
            </li>
          </ul>
        </div>
      </div>

      {/* Checkout Section */}
      <div className={cn("max-w-2xl mx-auto glass-panel p-8 rounded-3xl transition-all", selectedPlan ? "opacity-100 translate-y-0" : "opacity-50 pointer-events-none translate-y-4")}>
        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-zinc-100">Select Local Payment Method</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {wallets.map(wallet => (
            <button
              key={wallet.id}
              onClick={() => setSelectedWallet(wallet.id as any)}
              className={cn(
                "p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all",
                selectedWallet === wallet.id 
                  ? "border-corp-blue bg-corp-blue/5 dark:border-gold-500 dark:bg-gold-500/10" 
                  : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
              )}
            >
              <Smartphone className={cn("w-8 h-8", selectedWallet === wallet.id ? "text-corp-blue dark:text-gold-500" : "text-slate-500")} />
              <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">{wallet.name}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={handleCheckout}
          disabled={!selectedWallet || processing}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <CreditCard className="w-6 h-6" />
              Continue to Checkout
            </>
          )}
        </button>
      </div>
    </div>
  );
}
