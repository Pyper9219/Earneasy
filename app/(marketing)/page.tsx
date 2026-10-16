'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, Check, ChevronDown, Users, TrendingUp,
  Shield, Smartphone, Zap, DollarSign, Star, Clock,
  Globe, Award, Target, Rocket, Heart, MessageCircle,
  Play, ArrowUpRight, Layers, BarChart3, Wallet
} from 'lucide-react';

// ─── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />

      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-[15%] w-3 h-3 bg-emerald-400/40 rounded-full animate-float" />
        <div className="absolute top-48 right-[20%] w-2 h-2 bg-cyan-400/40 rounded-full animate-float-slow" />
        <div className="absolute bottom-32 left-[25%] w-4 h-4 bg-emerald-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050b1a] to-transparent" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-300">Kenya&apos;s #1 Referral Earning Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="text-white">Turn Your Network</span>
          <br />
          <span className="text-white">Into </span>
          <span className="text-gradient">M-Pesa Earnings</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed"
        >
          Activate for just <span className="text-white font-semibold">KES 450</span> and earn up to{' '}
          <span className="text-emerald-400 font-semibold">KES 400</span> per referral across 3 levels.
          Plus daily surveys for extra income.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/register"
            className="btn-shine group relative w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Earning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className="group w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 text-emerald-400" />
            See How It Works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Secure Payments</span>
          </div>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>10,000+ Members</span>
          </div>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Instant Payouts</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Stats Section ───────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: '10K+', label: 'Active Members', icon: Users },
    { value: 'KES 5M+', label: 'Total Paid Out', icon: Wallet },
    { value: '3 Levels', label: 'Commission Depth', icon: Layers },
    { value: '24/7', label: 'Support Available', icon: Globe },
  ];

  return (
    <section ref={ref} className="relative py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { number: '01', title: 'Create Account', description: 'Sign up for free with your phone number and email. Takes less than 2 minutes.', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { number: '02', title: 'Activate — KES 450', description: 'Pay the one-time activation fee via Flutterwave (M-Pesa, Card, Bank).', icon: Zap, color: 'from-emerald-500 to-teal-500' },
    { number: '03', title: 'Share Your Link', description: 'Get your unique referral link and share it with friends, family, and social media.', icon: ArrowRight, color: 'from-purple-500 to-pink-500' },
    { number: '04', title: 'Earn Commissions', description: 'Earn KES 250, 100, and 50 for each activation in your 3-level network.', icon: DollarSign, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 font-medium mb-4">
            <Target className="w-3.5 h-3.5" />
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            How It Works
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Start earning in 4 simple steps. No complex setup, no hidden fees.
          </p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative group"
            >
              <div className="relative glass rounded-2xl p-6 h-full card-hover">
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#0a1128] border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-400">{step.number}</span>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 mb-5`}>
                  <div className="w-full h-full rounded-[14px] bg-[#0a1128] flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Earning Levels ──────────────────────────────────────────────────────────
function EarningLevels() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const levels = [
    { level: 'Level 1', amount: 'KES 250', description: 'Direct referrals', icon: Users, gradient: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/30' },
    { level: 'Level 2', amount: 'KES 100', description: "Your referrals' referrals", icon: TrendingUp, gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/30' },
    { level: 'Level 3', amount: 'KES 50', description: 'Third-level network', icon: Award, gradient: 'from-purple-500 to-indigo-600', glow: 'shadow-purple-500/30' },
    { level: 'Surveys', amount: 'KES 30–150', description: 'Daily survey rewards', icon: MessageCircle, gradient: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/30', popular: true },
  ];

  return (
    <section id="earnings" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 font-medium mb-4">
            <DollarSign className="w-3.5 h-3.5" />
            Earning Potential
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Multiple Ways to <span className="text-gradient">Earn</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Earn commissions from your referral network plus daily survey rewards.
          </p>
        </motion.div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {levels.map((item, i) => (
            <motion.div
              key={item.level}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative group ${item.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {item.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-white shadow-lg shadow-amber-500/30 z-10">
                  NEW
                </div>
              )}
              <div className={`relative glass rounded-2xl p-6 h-full card-hover ${item.popular ? 'border-amber-500/30' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg ${item.glow} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.level}
                </h3>
                <div className="text-3xl font-bold text-gradient mb-2">{item.amount}</div>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 glass rounded-3xl p-8 lg:p-12 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Potential Earnings Calculator
          </h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            With just 10 direct referrals, each bringing 10 people, you could earn:
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="glass rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">KES 2,500</div>
              <div className="text-xs text-slate-500 mt-1">Level 1 (10×250)</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-2xl font-bold text-cyan-400">KES 10,000</div>
              <div className="text-xs text-slate-500 mt-1">Level 2 (100×100)</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">KES 5,000</div>
              <div className="text-xs text-slate-500 mt-1">Level 3 (100×50)</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
            <span className="text-lg font-bold text-white">Total Potential:</span>
            <span className="text-2xl font-bold text-gradient">KES 17,500</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features Section ────────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: Shield, title: 'Secure & Transparent', description: 'All transactions processed through Flutterwave. Track every commission in real-time.' },
    { icon: Smartphone, title: 'M-Pesa Ready', description: 'Request payouts directly to your M-Pesa. Fast, reliable, and convenient.' },
    { icon: BarChart3, title: 'Real-Time Dashboard', description: 'Monitor your referrals, earnings, and network growth from your personal dashboard.' },
    { icon: Rocket, title: 'Instant Activation', description: 'Pay once and start earning immediately. No waiting periods or hidden requirements.' },
    { icon: Heart, title: 'Community Driven', description: 'Join thousands of Kenyans already earning. Share success and grow together.' },
    { icon: Zap, title: 'Data Protection', description: 'Your personal data is encrypted and protected. We never share your information.' },
  ];

  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 font-medium mb-4">
            <Star className="w-3.5 h-3.5" />
            Why EarnEasy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Built for <span className="text-gradient">Your Success</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Everything you need to build your earning network, all in one platform.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    { name: 'James M.', location: 'Nairobi', text: "I earned KES 12,000 in my first month! The referral system is so easy to use. My M-Pesa was credited within hours.", earned: 'KES 12,000', avatar: '👨‍💼' },
    { name: 'Grace W.', location: 'Mombasa', text: "Best platform I've joined. The surveys alone give me extra income daily. Highly recommend to anyone looking to earn online.", earned: 'KES 8,500', avatar: '👩‍💻' },
    { name: 'Peter K.', location: 'Kisumu', text: "I was skeptical at first, but after my first payout I was convinced. Now my whole network is on EarnEasy!", earned: 'KES 25,000', avatar: '👨‍🎓' },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 font-medium mb-4">
            <Heart className="w-3.5 h-3.5" />
            Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Trusted by <span className="text-gradient">Thousands</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Real people, real earnings. Here&apos;s what our members say.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass rounded-2xl p-6 card-hover relative"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">{t.earned}</div>
                  <div className="text-xs text-slate-500">earned</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: 'How much does it cost to join?', a: 'The one-time activation fee is KES 450. After payment, your account is instantly activated and you can start earning immediately.' },
    { q: 'How do I earn commissions?', a: 'You earn KES 250 for each direct referral (Level 1), KES 100 for Level 2, and KES 50 for Level 3. When someone in your network activates, commissions are automatically credited.' },
    { q: 'How do I withdraw my earnings?', a: 'You can request payouts directly to your M-Pesa number from your dashboard. Payouts are processed within 24 hours.' },
    { q: 'Is there a limit to how much I can earn?', a: 'No! The more people you refer, the more you earn. There is no cap on your earnings across all 3 levels.' },
    { q: 'What are the daily surveys?', a: 'Activated members can access daily surveys that pay between KES 30–150 each. Complete surveys at your own pace for extra income.' },
    { q: 'Is my payment secure?', a: 'Absolutely. All payments are processed through Flutterwave, a licensed payment provider. Your financial data is encrypted and never stored on our servers.' },
  ];

  return (
    <section id="faqs" className="relative py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 font-medium mb-4">
            <MessageCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Got Questions?
          </h2>
          <p className="text-lg text-slate-400">Everything you need to know about EarnEasy.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full glass rounded-xl p-5 text-left hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-emerald-400' : ''}`} />
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to Start Earning?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-xl mx-auto text-lg text-emerald-100/80 mb-8"
            >
              Join thousands of Kenyans already earning with EarnEasy. Activate for KES 450 and start building your network today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="/register"
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-emerald-700 font-bold text-lg shadow-2xl shadow-black/20 hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started — KES 450
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                I Already Have an Account
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200/60"
            >
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4" /><span>No monthly fees</span></div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4" /><span>Instant activation</span></div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4" /><span>M-Pesa payouts</span></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Marquee Banner ──────────────────────────────────────────────────────────
function MarqueeBanner() {
  const items = [
    '🎉 Welcome to EarnEasy',
    '💰 Earn up to KES 400 per referral',
    '📱 Daily surveys available',
    '⚡ Instant M-Pesa payouts',
    '🔒 Secure Flutterwave payments',
    '🌍 10,000+ active members',
  ];

  return (
    <div className="relative overflow-hidden border-y border-emerald-500/20 bg-emerald-500/5 py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-sm font-medium text-emerald-400/80">{item}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[#050b1a] text-slate-200 overflow-hidden">
      <Hero />
      <MarqueeBanner />
      <Stats />
      <HowItWorks />
      <EarningLevels />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
