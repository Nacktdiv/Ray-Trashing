'use client'
import React, {useEffect, useState} from 'react';
import { Trophy, Medal, ChevronUp, Users, Info, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import getLeaderboard from '@/app/services/leaderboard/getLeaderboard.js'

const RTLeaderboard = () => {
  const {profile} = useUser();

  const [leaderboardData, setLeaderboardData] = useState({
    region: '',
    leaderboard: []
  });

  useEffect(()=> {
    const fetchData = async () => { 
      const res = await getLeaderboard(profile?.rt_id) 
      if (res.success) {
        setLeaderboardData(res.data)
      } else {
        toast.error("Error fetching leaderboard:", res.message)
      }
    }
    if (profile?.rt_id) {
      fetchData()
    }
  }, []) 

  // Data dummy yang merepresentasikan akumulasi poin RT [1]
  // const leaderboardData = [
  //   { rank: 1, name: "RT 05 / RW 02", points: "12,450", trend: "up", members: 42 },
  //   { rank: 2, name: "RT 01 / RW 05", points: "10,820", trend: "stable", members: 38 },
  //   { rank: 3, name: "RT 03 / RW 02", points: "9,150", trend: "up", members: 31 },
  //   { rank: 4, name: "RT 02 / RW 01", points: "8,400", trend: "down", members: 29 },
  //   { rank: 5, name: "RT 04 / RW 05", points: "7,900", trend: "up", members: 25 },
  // ];

  // Data RT Pengguna (RT 03) untuk fitur "Distance to Next Rank" [1]

  const currentRT = leaderboardData.leaderboard.find(rt => rt.id === profile?.rt_id);

  const countNextRankPoints = () => {
    const currentRT = leaderboardData.leaderboard.find(rt => rt.id === profile?.rt_id);
    if (!currentRT) return null;

    const nextRankRT = leaderboardData.leaderboard.find(rt => rt.rank === currentRT.rank - 1);
    if (!nextRankRT) return null;
    
    return nextRankRT.points - currentRT.points;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Section */}
      <header className="bg-gradient-to-b from-emerald-600 to-emerald-700 pt-12 pb-20 px-6 rounded-b-[3rem] shadow-lg">
        <div className="flex justify-between items-center text-white mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-amber-300" /> Peringkat RT
          </h1>
          <button className="p-2 bg-white/20 rounded-full">
            <Info size={20} />
          </button>
        </div>
        
        {/* Top 3 Podium Cards */}
        <div className="flex justify-center items-end gap-3 mt-4">
          {/* Rank 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 bg-slate-200 rounded-full mb-2 flex items-center justify-center border-2 border-white shadow-md">
              <Medal size={24} className="text-slate-400" />
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl w-full text-center border border-white/20 h-24 flex flex-col justify-center">
              <p className="text-sm md:text-md text-emerald-100 font-bold uppercase">{leaderboardData?.leaderboard[1]?.name}</p>
              <p className="text-md md:text-xl font-black text-white">{leaderboardData?.leaderboard[1]?.points}</p>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center flex-1 -translate-y-4">
            <div className="w-16 h-16 bg-amber-400 rounded-full mb-2 flex items-center justify-center border-4 border-white shadow-xl">
              <Trophy size={32} className="text-white" />
            </div>
            <div className="bg-white p-4 rounded-2xl w-full text-center shadow-2xl h-32 flex flex-col justify-center">
              <p className="text-sm md:text-md text-emerald-700 font-black uppercase">{leaderboardData?.leaderboard[0]?.name}</p>
              <p className="text-md md:text-xl font-black text-slate-800">{leaderboardData?.leaderboard[0]?.points}</p>
              <div className="flex items-center justify-center text-xs md:text-sm text-emerald-600 font-bold mt-1">
                <Star size={14} fill="currentColor" /> Juara Bertahan
              </div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 bg-amber-700 rounded-full mb-2 flex items-center justify-center border-2 border-white shadow-md">
              <Medal size={24} className="text-amber-200" />
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl w-full text-center border border-white/20 h-24 flex flex-col justify-center">
              <p className="text-sm md:text-md text-emerald-100 font-bold uppercase">{leaderboardData?.leaderboard[2]?.name}</p>
              <p className="text-md md:text-xl font-black text-white">{leaderboardData?.leaderboard[2]?.points}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Distance to Next Rank (User Specific) [1] */}
      <section className="px-6 -mt-10 relative z-10">
        <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between border border-blue-400">
          <div className="space-y-1"> 
            <p className="text-xs font-bold opacity-80 italic">Status RT Anda ({currentRT?.rank })</p>
            <h3 className="text-lg font-black leading-tight">Butuh {countNextRankPoints()} poin lagi <br/> untuk naik peringkat!</h3>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl hover:scale-125 transition-all duration-300">
            <Link href="/project">
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Full Leaderboard List */}
      <section className="p-6 space-y-4">
        <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
          <ChevronUp className="text-emerald-500" /> Seluruh Wilayah
        </h2>
        
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 divide-y divide-slate-50">
          {leaderboardData?.leaderboard?.map((rt) => (
            <div 
              key={rt.rank} 
              className={`p-5 flex items-center justify-between transition-colors transition-all duration-1000 ease-in-out ${
                rt.id === profile?.rt_id ? 'bg-blue-100 hover:scale-[1.02] hover:shadow-md hover:z-10 hover:relative ' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 text-center font-black ${
                  rt.rank <= 3 ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  #{rt.rank}
                </span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{rt.name}</h4>
                  <div className={`flex items-center gap-2 text-[10px] ${rt.rank <= 3 ? 'text-blue-600' : 'text-slate-400'} font-bold`}>
                    <Users size={12} /> {rt.members} Eco-Warriors
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-700 text-base">{rt.points}</p>
                <p className={`text-[10px] font-bold ${rt.rank <= 3 ? 'text-blue-600' : 'text-slate-400'} uppercase tracking-tighter`}>Poin Akumulasi</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Insight */}
      <p className="text-center px-12 text-[10px] text-slate-400 font-medium">
        Poin dihitung berdasarkan total sampah yang divalidasi dan proyek kerajinan yang diselesaikan oleh seluruh warga di lingkungan RT terkait.
      </p>
    </div>
  );
};

export default RTLeaderboard;