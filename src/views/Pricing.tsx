import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Building, Zap, MessageSquare, Headphones, Shield, Smartphone, QrCode, Bitcoin, ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const plans = {
  free: { name: 'Free Forever', price: 0, usdt: 0 },
  pro_6m: { name: 'Pro 6 Months', price: 5000, usdt: 1.50 },
  pro_12m: { name: 'Pro 12 Months', price: 10000, usdt: 3.00 },
  pro_plus_6m: { name: 'Pro Plus 6 Months', price: 15000, usdt: 4.50 },
  pro_plus_life: { name: 'Pro Plus Lifetime', price: 30000, usdt: 9.00 }
};

const wallets = [
  { id: 'kbz', name: 'KBZ Pay', accountName: 'Kyaw Myo', accountNo: '09 79 123 4567', icon: Smartphone },
  { id: 'wave', name: 'Wave Pay', accountName: 'Kyaw Myo', accountNo: '09 97 123 4567', icon: Smartphone },
  { id: 'aya', name: 'AYA Pay', accountName: 'Kyaw Myo', accountNo: '09 42 123 4567', icon: Smartphone },
  { id: 'crypto', name: 'Crypto (USDT)', accountName: 'Binance Pay', accountNo: 'TYVf1Xk8LqX5bZ9... (TRC20)', icon: Bitcoin, network: 'Tron (TRC20)' }
];

export default function Pricing() {
  const [step, setStep] = useState<'pricing' | 'checkout' | 'processing' | 'success'>('pricing');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof plans | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { user, appUser } = useAuth();

  useEffect(() => {
    let timer: any;
    if (step === 'checkout' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'checkout') {
      setStep('pricing');
      setTimeLeft(300);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleStartCheckout = () => {
    if (!selectedWallet || !selectedPlan || !user) return;
    setStep('checkout');
    setTimeLeft(300);
  };

  const handlePaid = () => {
    setStep('processing');
  };

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500 px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 mb-8">
          <ClockIcon className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-100 mb-4 text-center">Payment Processing</h1>
        <div className="glass-panel p-8 rounded-2xl max-w-xl w-full text-center space-y-6">
          <p className="text-lg text-slate-600 dark:text-zinc-300">
            Admin will approve your payment and verify your order within <strong>24 hours</strong>.
          </p>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-medium border border-purple-100 dark:border-purple-800/30">
            Please keep your transaction screenshot until your account is upgraded.
          </div>
          
          <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
            <p className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Contact Support</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="mailto:support@milestone.com" className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                <Mail className="w-4 h-4" /> Email
              </a>
              <a href="https://t.me/milestonesupport" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 text-[#229ED9] rounded-lg text-sm font-medium transition-colors">
                <MessageCircle className="w-4 h-4" /> Telegram
              </a>
              <a href="viber://chat?number=%2B95900000000" className="flex items-center justify-center gap-2 px-4 py-2 bg-[#7360F2]/10 hover:bg-[#7360F2]/20 text-[#7360F2] rounded-lg text-sm font-medium transition-colors">
                <MessageSquare className="w-4 h-4" /> Viber
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    const plan = plans[selectedPlan as keyof typeof plans];
    const wallet = wallets.find(w => w.id === selectedWallet);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <div className="max-w-2xl mx-auto py-12 animate-in fade-in duration-500 px-4">
        <button onClick={() => setStep('pricing')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Plans
        </button>
        
        <div className="glass-panel rounded-3xl p-8 shadow-xl">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-200 dark:border-zinc-800">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-1">Complete Payment</h2>
              <p className="text-slate-500 dark:text-zinc-400">Order: {plan?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-corp-blue dark:text-gold-500">{plan?.price.toLocaleString()} MMK</div>
              <div className="text-sm font-bold text-slate-400">~ ${plan?.usdt.toFixed(2)} USDT</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-inner border border-slate-200 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-slate-800" />
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-zinc-100">
                  <wallet.icon className="w-5 h-5 text-corp-blue dark:text-gold-500" /> {wallet?.name}
                </div>
              </div>
              
              {wallet?.network && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Network</p>
                  <p className="text-md font-mono font-bold text-slate-700 dark:text-zinc-300">{wallet?.network}</p>
                </div>
              )}
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account Name</p>
                <p className="text-md font-bold text-slate-700 dark:text-zinc-300">{wallet?.accountName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account / Address</p>
                <p className="text-md font-mono font-bold text-slate-700 dark:text-zinc-300 break-all">{wallet?.accountNo}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl flex items-center justify-between mb-8 border border-red-100 dark:border-red-500/20">
            <span className="text-sm font-bold text-red-600 dark:text-red-400">Awaiting Payment...</span>
            <span className="text-lg font-mono font-black text-red-600 dark:text-red-400">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setStep('pricing')}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handlePaid}
              className="flex-1 py-4 bg-corp-blue hover:bg-indigo-700 dark:bg-gold-600 dark:hover:bg-gold-500 text-white dark:text-black font-bold rounded-xl shadow-lg transition-all"
            >
              Completed Paid
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20 px-4">
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
          Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">PRO</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
          Unlock beautiful custom card templates, upload your own logos, and connect to thousands of employees. Select your plan below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Object.entries(plans).map(([key, plan]) => (
          <div 
            key={key}
            onClick={() => key !== 'free' && setSelectedPlan(key as any)}
            className={cn(
              "rounded-3xl p-6 transition-all border-2 relative",
              key !== 'free' ? "cursor-pointer" : "opacity-80 cursor-default",
              key === 'pro_plus_life' ? "bg-gradient-to-b from-indigo-900 to-purple-900 shadow-2xl" : "glass-panel",
              selectedPlan === key 
                ? (key === 'pro_plus_life' ? "border-gold-400 scale-105 z-10" : "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]") 
                : (key === 'pro_plus_life' ? "border-purple-700/50 hover:border-gold-400/50 scale-100" : (key === 'free' ? "border-slate-200 dark:border-zinc-800" : "border-transparent hover:border-purple-500/50"))
            )}
          >
            {key === 'pro_plus_life' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-gold-500 to-yellow-400 rounded-full text-[10px] font-bold text-black uppercase tracking-wider shadow-lg whitespace-nowrap">
                Popular & Recommended
              </div>
            )}
            {key === 'free' && appUser?.role !== 'pro' && appUser?.role !== 'admin' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-200 dark:bg-zinc-700 rounded-full text-[10px] font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider shadow-sm whitespace-nowrap">
                Your Current Plan
              </div>
            )}
            <h3 className={cn("text-xl font-bold", key === 'pro_plus_life' ? "text-white" : "text-slate-900 dark:text-zinc-100")}>
              {plan.name.split(' ')[0]} {plan.name.split(' ')[1] === 'Plus' ? 'Plus' : ''}
            </h3>
            <p className={cn(
              "text-xs font-bold uppercase tracking-wide mb-4",
              key === 'pro_plus_life' ? "text-gold-400" : key.includes('plus') ? "text-gold-500" : "text-purple-600 dark:text-purple-400"
            )}>
              {plan.name.replace('Pro ', '').replace('Plus ', '')}
            </p>
            <div className={cn("flex items-baseline gap-1 mb-1", key === 'pro_plus_life' ? "text-white" : "text-slate-900 dark:text-zinc-100")}>
              <span className="text-3xl font-extrabold">{plan.price.toLocaleString()}</span>
              <span className={cn("font-medium", key === 'pro_plus_life' ? "text-purple-300" : "text-slate-500")}>MMK</span>
            </div>
            <p className={cn("text-xs font-bold mb-6", key === 'pro_plus_life' ? "text-gold-300" : "text-slate-400")}>
              (~ ${plan.usdt.toFixed(2)} USDT)
            </p>
            
            <ul className={cn("space-y-3 mb-8", key === 'pro_plus_life' ? "text-purple-100" : "")}>
              {key.includes('plus') && (
                <li className={cn("flex items-start gap-2 text-sm font-bold", !key.includes('life') ? "text-slate-900 dark:text-zinc-100" : "text-white")}>
                  <Zap className={cn("w-5 h-5 shrink-0", key === 'pro_plus_life' ? "text-gold-400" : "text-gold-500")} /> Everything from Pro
                </li>
              )}
              <li className={cn("flex items-start gap-2 text-sm", !key.includes('life') ? "text-slate-600 dark:text-zinc-300" : "")}>
                <CheckCircle2 className={cn("w-5 h-5 shrink-0", key === 'pro_plus_life' ? "text-gold-400" : key.includes('plus') ? "text-gold-500" : "text-purple-500")} /> 
                {key === 'free' ? 'Up to 10 Employees' : key.includes('plus') ? 'Unlimited Employees' : 'Up to 1,000 Employees'}
              </li>
              <li className={cn("flex items-start gap-2 text-sm", !key.includes('life') ? "text-slate-600 dark:text-zinc-300" : "")}>
                <CheckCircle2 className={cn("w-5 h-5 shrink-0", key === 'pro_plus_life' ? "text-gold-400" : key.includes('plus') ? "text-gold-500" : "text-purple-500")} /> 
                {key === 'free' ? 'Basic Templates' : key.includes('life') ? 'Feature Requests to Dev Team' : key.includes('plus') ? 'Feature Requests' : 'Customize Column Data Fields'}
              </li>
              <li className={cn("flex items-start gap-2 text-sm", !key.includes('life') ? "text-slate-600 dark:text-zinc-300" : "")}>
                <Headphones className={cn("w-5 h-5 shrink-0", key === 'pro_plus_life' ? "text-gold-400" : key.includes('plus') ? "text-gold-500" : "text-purple-500")} /> 
                {key === 'free' ? 'Standard Support' : key.includes('life') ? 'Priority Customer Support' : key.includes('plus') ? 'Customer Support' : 'Card Templates'}
              </li>
              {key === 'pro_plus_life' && (
                <li className="flex items-start gap-2 text-sm">
                  <Building className="w-5 h-5 text-gold-400 shrink-0" /> Custom Integrations
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className={cn("max-w-2xl mx-auto glass-panel p-8 rounded-3xl transition-all", selectedPlan ? "opacity-100 translate-y-0" : "opacity-50 pointer-events-none translate-y-4")}>
        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-zinc-100">Select Payment Method</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {wallets.map(wallet => (
            <button
              key={wallet.id}
              onClick={() => setSelectedWallet(wallet.id)}
              className={cn(
                "p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all",
                selectedWallet === wallet.id 
                  ? "border-corp-blue bg-corp-blue/5 dark:border-gold-500 dark:bg-gold-500/10" 
                  : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
              )}
            >
              <wallet.icon className={cn("w-8 h-8", selectedWallet === wallet.id ? "text-corp-blue dark:text-gold-500" : "text-slate-500")} />
              <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 text-center">{wallet.name}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={handleStartCheckout}
          disabled={!selectedWallet}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <CreditCard className="w-6 h-6" />
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
