'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { Trophy, Medal, ChevronUp, Users, Info, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import getLeaderboard from '@/app/services/leaderboard/getLeaderboard.js'

const RTLeaderboard = () => {
  const {profile} = useUser();

  const [leaderboardData, setLeaderboardData] = useState({
    mode: 'kecamatan',
    leaderboard: []
  });

  useEffect(()=> {
    const fetchData = async () => { 
      const res = await getLeaderboard(profile?.region_id, leaderboardData.mode)
      if (res.success) {
        setLeaderboardData({...leaderboardData, leaderboard: res.data})
      } else {
        toast.error("Error fetching leaderboard:", res.message)
      }
    }
    if (profile?.region_id) {
      fetchData()
    }
  }, [leaderboardData.mode, profile?.region_id]) 

  const processedData = useMemo(() => {
    const currentData = leaderboardData.mode === 'pengguna'
      ? leaderboardData.leaderboard.find(region => region.region_id === profile?.region_id)
      : leaderboardData.leaderboard.find(region => region.id === profile?.region_id);

    const nextData = leaderboardData.leaderboard.find(region => region.rank === currentData?.rank - 1);

    const nextPointsNeeded = nextData && currentData ? nextData.points - currentData.points : 0;

    return {
      currentData,
      nextData,
      nextPointsNeeded
    }
  }, [leaderboardData.leaderboard, profile?.region_id]);

  // Data dummy yang merepresentasikan akumulasi poin RT [1]
  // const leaderboardData = [
  //   { 
  //     rank: 1, 
  //     name: "Banjamlati", 
  //     points: "400", 
  //     trend: "up", 
  //     members: 45 // simulasi
  //   },
  //   { 
  //     rank: 2, 
  //     name: "Bandar Kidul", 
  //     points: "0", 
  //     trend: "stable", 
  //     members: 32 // simulasi
  //   },
  //   { 
  //     rank: 3, 
  //     name: "Tamanan", 
  //     points: "0", 
  //     trend: "up", 
  //     members: 28 // simulasi
  //   },
  //   { 
  //     rank: 4, k = leaderboardData.leaderboard.find(region => region.rank === currentRank.rank - 1);

  //     name: "Bandar Lor", 
  //     points: "0", 
  //     trend: "down", 
  //     members: 30 // simulasi
  //   },
  //   { 
  //     rank: 5, 
  //     name: "Mojoroto", 
  //     points: "0", 
  //     trend: "up", 
  //     members: 25 // simulasi
  //   },
  // ];


  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Section */}
      <header className="bg-gradient-to-b from-custom-second to-custom-third pt-12 pb-20 px-6 rounded-b-[3rem] shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white mb-8 h-fit">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-amber-300" /> {leaderboardData.mode === 'kecamatan' ? 'Leaderboard Kecamatan' : leaderboardData.mode === 'kotakab' ? 'Leaderboard Kota/Kabupaten' : 'Leaderboard Users'}
          </h1>
          <div className='flex flex-row gap-2 text-xs md:text-base bg-transparent border border-custom-first shadow-md h-fit p-2 md:rounded-full rounded-2xl'>
            <button 
            onClick={() => setLeaderboardData({...leaderboardData, mode:"kecamatan"})}
            className={`md:rounded-full rounded-2xl p-2 transition-all ${leaderboardData.mode === 'kecamatan' ? 'bg-custom-third text-white border-none' : 'border border-custom-alter text-black'}`}>Kecamatan</button>
            <button 
            onClick={() => setLeaderboardData({...leaderboardData, mode:"kotakab"})}
            className={`md:rounded-full rounded-2xl p-2 transition-all ${leaderboardData.mode === 'kotakab' ? 'bg-custom-third text-white border-none' : 'border border-custom-alter text-black'}`}>Kota/Kabupaten</button>
            <button 
            onClick={() => setLeaderboardData({...leaderboardData, mode:"pengguna"})}
            className={`md:rounded-full rounded-2xl p-2 transition-all ${leaderboardData.mode === 'pengguna' ? 'bg-custom-third text-white border-none' : 'border border-custom-alter text-black'}`}>Users</button>
          </div>
        </div>
        
        {/* Top 3 Podium Cards */}
        <div className="flex justify-center items-end gap-3 mt-4">
          {/* Rank 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-10 md:w-12 aspect-square bg-slate-200 rounded-full mb-2 flex items-center justify-center border-2 border-white shadow-md">
              <Medal size={24} className="text-slate-400" />
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl w-full text-center border border-white/20 md:h-24 h-30 flex flex-col justify-center">
              <p className="text-xs md:text-md text-custom-first font-bold uppercase">{leaderboardData?.leaderboard[1]?.name}</p>
              <p className="text-sm md:text-xl font-black text-white">{leaderboardData?.leaderboard[1]?.points}</p>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center flex-1 -translate-y-4">
            <div className="w-14 md:w-16 aspect-square bg-amber-400 rounded-full mb-2 flex items-center justify-center border-4 border-white shadow-xl">
              <Trophy size={32} className="text-white" />
            </div>
            <div className="bg-white p-4 rounded-2xl w-full text-center shadow-2xl md:h-32 h-38 flex flex-col justify-center">
              <p className="text-xs md:text-md text-custom-second font-black uppercase">{leaderboardData?.leaderboard[0]?.name}</p>
              <p className="text-sm md:text-xl font-black text-custom-alter">{leaderboardData?.leaderboard[0]?.points}</p>
              <div className="flex items-center justify-center text-xs md:text-sm text-custom-second font-bold mt-1">
                <Star size={14} fill="currentColor" /> Defending Champion
              </div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-10 md:w-12 aspect-square bg-amber-700 rounded-full mb-2 flex items-center justify-center border-2 border-white shadow-md">
              <Medal size={24} className="text-amber-200" />
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl w-full text-center border border-white/20 md:h-24 h-30 flex flex-col justify-center">
              <p className="text-xs md:text-md text-custom-first font-bold uppercase">{leaderboardData?.leaderboard[2]?.name}</p>
              <p className="text-sm md:text-xl font-black text-white">{leaderboardData?.leaderboard[2]?.points}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Distance to Next Rank (User Specific) [1] */}
      <section className="px-6 -mt-10 relative z-10">
        <div className="bg-custom-third text-white p-5 rounded-3xl shadow-xl flex items-center justify-between border border-custom-first shadow-md shadow-custom-first/60">
          <div className="space-y-1"> 
            <p className="text-xs font-bold opacity-80 italic">Your status: {processedData?.currentData?.rank}</p>
            <h3 className="text-lg font-black leading-tight">Need {processedData?.nextPointsNeeded} more points <br/> to advance!</h3>
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
        <h2 className="font-black text-custom-second uppercase tracking-widest text-xs flex items-center gap-2">
          <ChevronUp className="text-custom-alter" /> Full Leaderboard
        </h2>
        
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 divide-y divide-slate-50">
          {leaderboardData?.leaderboard?.map((region) => (
            <div 
              key={region.rank} 
              className={`p-5 flex items-center justify-between transition-colors transition-all duration-1000 ease-in-out ${
                region?.id === profile?.region_id ? 'bg-blue-100 hover:scale-[1.02] hover:shadow-md hover:z-10 hover:relative ' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 text-center font-black ${
                  region?.rank <= 3 ? 'text-custom-second' : 'text-slate-400'
                }`}>
                  #{region?.rank}
                </span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{region?.name}</h4>
                  {leaderboardData.mode != 'pengguna' && (
                    <div className={`flex items-center gap-2 text-[10px] ${region?.rank <= 3 ? 'text-custom-alter' : 'text-slate-400'} font-bold`}>
                      <Users size={12} /> {region?.members} Eco-Warriors
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-custom-second text-base">{region?.points}</p>
                <p className={`text-[10px] font-bold ${region?.rank <= 3 ? 'text-custom-alter' : 'text-slate-400'} uppercase tracking-tighter`}>Accumulated Points</p>
              </div>
            </div>
          ))}
          {/* {leaderboardData?.map((region) => (
            <div 
              key={region.rank} 
              className={`p-5 flex items-center justify-between transition-colors transition-all duration-1000 ease-in-out ${
                region.id === 1 ? 'bg-blue-100 hover:scale-[1.02] hover:shadow-md hover:z-10 hover:relative ' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 text-center font-black ${
                  region.rank <= 3 ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  #{region.rank}
                </span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{region.name}</h4>
                  <div className={`flex items-center gap-2 text-[10px] ${region.rank <= 3 ? 'text-blue-600' : 'text-slate-400'} font-bold`}>
                    <Users size={12} /> {region.members} Eco-Warriors
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-700 text-base">{region.points}</p>
                <p className={`text-[10px] font-bold ${region.rank <= 3 ? 'text-blue-600' : 'text-slate-400'} uppercase tracking-tighter`}>Poin Akumulasi</p>
              </div>
            </div>
          ))} */}
        </div>
      </section>

      {/* Footer Insight */}
      <p className="text-center px-12 text-[10px] text-slate-400 font-medium">
        Points are accumulated based on the total waste collected by each region, verified through our integrated system. The more waste collected, the higher the points and rank on the leaderboard. Keep up the great work and let's make a difference together!
      </p>
    </div>
  );
};

export default RTLeaderboard;