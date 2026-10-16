'use client';
import { useState } from 'react';
import { MessageCircle, DollarSign, Lock, X, CheckCircle } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  image: string;
  ratePerHour: number;
  gender: 'male' | 'female';
  bio: string;
}

const PROFILES: Profile[] = [
  { id: 1, name: 'Emma Thompson', age: 28, location: 'London, UK', image: 'https://i.pravatar.cc/150?img=47', ratePerHour: 12, gender: 'female', bio: 'Love traveling and learning about new cultures' },
  { id: 2, name: 'James Wilson', age: 32, location: 'New York, USA', image: 'https://i.pravatar.cc/150?img=12', ratePerHour: 15, gender: 'male', bio: 'Entrepreneur interested in African business opportunities' },
  { id: 3, name: 'Sophie Anderson', age: 26, location: 'Manchester, UK', image: 'https://i.pravatar.cc/150?img=45', ratePerHour: 10, gender: 'female', bio: 'Teacher passionate about cultural exchange' },
  { id: 4, name: 'Michael Brown', age: 35, location: 'Los Angeles, USA', image: 'https://i.pravatar.cc/150?img=33', ratePerHour: 14, gender: 'male', bio: 'Tech enthusiast looking for meaningful conversations' },
  { id: 5, name: 'Olivia Davis', age: 29, location: 'Toronto, Canada', image: 'https://i.pravatar.cc/150?img=49', ratePerHour: 11, gender: 'female', bio: 'Writer exploring global perspectives' },
  { id: 6, name: 'David Miller', age: 31, location: 'Sydney, Australia', image: 'https://i.pravatar.cc/150?img=52', ratePerHour: 13, gender: 'male', bio: 'Marketing professional interested in African markets' },
  { id: 7, name: 'Charlotte White', age: 27, location: 'Edinburgh, UK', image: 'https://i.pravatar.cc/150?img=44', ratePerHour: 9, gender: 'female', bio: 'Artist fascinated by diverse cultures' },
  { id: 8, name: 'Robert Taylor', age: 34, location: 'Chicago, USA', image: 'https://i.pravatar.cc/150?img=60', ratePerHour: 15, gender: 'male', bio: 'Consultant seeking authentic connections' },
  { id: 9, name: 'Isabella Martinez', age: 30, location: 'Madrid, Spain', image: 'https://i.pravatar.cc/150?img=48', ratePerHour: 10, gender: 'female', bio: 'Language lover wanting to practice English' },
];

export default function ChatPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const handleStartChat = (profile: Profile) => {
    if (isPaid) {
      alert(`Starting chat with ${profile.name}...`);
    } else {
      setSelectedProfile(profile);
      setShowPaymentModal(true);
    }
  };

  const handlePayment = () => {
    setIsPaid(true);
    setShowPaymentModal(false);
    alert('Payment successful! You can now start chatting.');
  };

  return (
    <main className="min-h-screen bg-[#0B1326] text-white">
      <section className="relative px-4 py-16 text-center max-w-5xl mx-auto border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium mb-6">
          <MessageCircle className="w-4 h-4" /> Premium Chat Service
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Chat with People Worldwide & <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">Earn Dollars</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          Connect with international clients who are willing to pay <span className="text-white font-bold">$9–$15 per hour</span> for meaningful conversations and cultural exchange.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /><span className="text-slate-300">Verified Profiles</span></div>
          <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /><span className="text-slate-300">Instant Payments</span></div>
          <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /><span className="text-slate-300">24/7 Support</span></div>
        </div>
      </section>

      <section className="px-4 py-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Available Chat Partners</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFILES.map((profile) => (
            <div key={profile.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/50 transition-all group">
              <div className="flex items-start gap-4 mb-4">
                <img src={profile.image} alt={profile.name} className="w-16 h-16 rounded-full object-cover border-2 border-rose-500/30" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold group-hover:text-rose-400 transition-colors">{profile.name}</h3>
                  <p className="text-sm text-slate-400">{profile.age} years • {profile.location}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-4 line-clamp-2">{profile.bio}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-extrabold text-emerald-400">${profile.ratePerHour}</span>
                  <span className="text-sm text-slate-400">/hour</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase">
                  {profile.gender === 'male' ? 'Male' : 'Female'}
                </span>
              </div>
              <button
                onClick={() => handleStartChat(profile)}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                START CHAT
              </button>
            </div>
          ))}
        </div>
      </section>

      {showPaymentModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-[#0B1326] border border-white/10 rounded-2xl p-8 relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Unlock Chat Access</h2>
              <p className="text-slate-400 text-sm">Pay once to unlock unlimited chats with all verified profiles</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Chat with:</span>
                <span className="font-bold">{selectedProfile.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Their rate:</span>
                <span className="font-bold text-emerald-400">${selectedProfile.ratePerHour}/hour</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Activation Fee:</span>
                  <span className="text-2xl font-extrabold text-rose-400">KES 450</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25"
            >
              Pay KES 450 via M-Pesa
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">
              Secure payment processed by Flutterwave. Instant activation.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}