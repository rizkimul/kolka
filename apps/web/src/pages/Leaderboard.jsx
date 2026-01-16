import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Trophy, Medal, Crown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { leaderboardApi } from '../services/api';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global');

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      const data = activeTab === 'global' 
        ? await leaderboardApi.getGlobal(20)
        : await leaderboardApi.getWeekly(20);
      
      setLeaderboard(data);

      try {
        const rank = await leaderboardApi.getMyRank();
        setMyRank(rank);
      } catch (e) {
        setMyRank(null);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown size={24} className="text-yellow-500" />;
      case 2:
        return <Medal size={24} className="text-gray-400" />;
      case 3:
        return <Medal size={24} className="text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">{rank}</span>;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-[900px] mx-auto px-6 py-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 md:px-4 md:py-2 rounded-full md:rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline text-sm font-medium text-gray-600">Kembali</span>
            </button>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 md:w-7 md:h-7 text-amber-500" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Peringkat</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-6 md:px-8 lg:px-12">
        {/* Tab Switcher */}
        <div className="flex bg-white rounded-xl p-1 shadow-md mb-6">
          <button 
            className={`flex-1 py-3 md:py-4 rounded-lg font-semibold transition-all md:text-lg ${
              activeTab === 'global' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('global')}
          >
            Semua Waktu
          </button>
          <button 
            className={`flex-1 py-3 md:py-4 rounded-lg font-semibold transition-all md:text-lg ${
              activeTab === 'weekly' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('weekly')}
          >
            Minggu Ini
          </button>
        </div>

        {/* User's Rank */}
        {myRank && myRank.rank > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 md:p-8 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base opacity-90">Peringkatmu</p>
                <p className="text-4xl md:text-5xl font-bold">#{myRank.rank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm md:text-base opacity-90">dari</p>
                <p className="text-xl md:text-2xl font-semibold">{myRank.totalPlayers} pemain</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {loading ? (
            <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Memuat peringkat...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-800 font-semibold">Belum ada peringkat</p>
              <p className="text-gray-600">Jadilah yang pertama!</p>
            </div>
          ) : (
            leaderboard.map((entry) => (
              <div 
                key={entry.userId} 
                className={`rounded-2xl shadow-md p-4 md:p-5 ${getRankBg(entry.rank)} ${
                  entry.userId === user?.id ? 'ring-2 ring-purple-400' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="text-3xl md:text-4xl">
                    {entry.image || '🦁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 truncate md:text-lg">{entry.name}</span>
                      {entry.userId === user?.id && (
                        <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                          Kamu
                        </span>
                      )}
                    </div>
                    <span className="text-sm md:text-base text-gray-600">
                      Level {entry.currentLevel} • ⭐ {entry.totalStars}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl md:text-2xl font-bold text-purple-600">
                      {entry.totalScore.toLocaleString()}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">poin</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
