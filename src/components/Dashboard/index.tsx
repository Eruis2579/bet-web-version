import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../CustomComponents/MainLayout';
import { TrendingUp, DollarSign, Trophy, Activity, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import First from "../../assets/images/dashboard/first.png"
import Second from "../../assets/images/dashboard/second.png"
import Third from "../../assets/images/dashboard/third.png"
import Fourth from "../../assets/images/dashboard/fourth.jpg"
import Fifth from "../../assets/images/dashboard/fifth.png"
import Sixth from "../../assets/images/dashboard/sixth.png"
import { useNavigate } from "react-router-dom";
const CarouselImage: React.FC<{ src: string; alt: string; isActive: boolean }> = ({ src, alt, isActive }) => (
  <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
    <img
      src={src}
      alt={alt}
      className="w-full h-full bg-cover rounded-2xl"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const navigate = useNavigate();

  const carouselImages = [
    {
      src: First,
      alt: "Sports Betting Action"
    },
    {
      src: Second,
      alt: "Live Sports Betting"
    },
    {
      src: Third,
      alt: "Sports Analytics"
    },
    {
      src: Fourth,
      alt: "Championship Betting"
    },
    {
      src: Fifth,
      alt: "Championship Betting"
    },
    {
      src: Sixth,
      alt: "Championship Betting"
    }
  ];

  // Auto-advance carousel
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Welcome back, {user?.firstName}!
            </h2>
            <p className="text-gray-400">
              Ready to place some winning bets? Here's your dashboard overview.
            </p>
          </div>
          <button onClick={() => navigate('/bet')} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <h2 className="hidden md:block text-lg font-semibold">Place New Bet</h2>
          </button>
        </div>

        {/* Image Carousel */}
        <div className="relative h-[200px] md:h-[600px] mb-8 rounded-2xl overflow-hidden">
          {carouselImages.map((image, index) => (
            <CarouselImage
              key={index}
              src={image.src}
              alt={image.alt}
              isActive={index === currentSlide}
            />
          ))}

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>

          {/* Overlay Content */}
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Live Sports Action</h3>
            <p className="text-white/90">Place your bets on today's biggest games</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Account Balance</p>
                <p className="text-2xl font-bold text-white">
                  ${user?.balance.toLocaleString('en-US')}
                </p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Bets</p>
                <p className="text-2xl font-bold text-white">
                  ${user?.totalBets}
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Profits</p>
                <p className="text-2xl font-bold text-white">
                  ${user?.totalProfit}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Win Rate</p>
                <p className="text-2xl font-bold text-white">
                  {user?.winRate}%
                </p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bettor Rankings */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Top Bettors This Week</h3>
            <p className="text-gray-400">See who's leading the leaderboards across different sports</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* NFL Rankings */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="bg-orange-500/20 p-2 rounded-lg mr-3">
                  <span className="text-orange-400 text-lg">🏀</span>
                </div>
                <h4 className="text-lg font-semibold text-white">NBA Leaders</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-bold mr-2">1.</span>
                    <span className="text-white">Mike_Wins</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$2,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-300 font-bold mr-2">2.</span>
                    <span className="text-white">BetMaster</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$1,890</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-amber-600 font-bold mr-2">3.</span>
                    <span className="text-white">SportsFan22</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$1,650</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-2">4.</span>
                    <span className="text-white">QuickPick</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$1,320</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-2">5.</span>
                    <span className="text-white">LuckyStreak</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$1,180</span>
                </div>
              </div>
            </div>

            {/* NBA Rankings */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="bg-orange-500/20 p-2 rounded-lg mr-3">
                  <span className="text-orange-400 text-lg">⚾️</span>
                </div>
                <h4 className="text-lg font-semibold text-white">MLB Leaders</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-bold mr-2">1.</span>
                    <span className="text-white">CourtKing</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$3,120</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-300 font-bold mr-2">2.</span>
                    <span className="text-white">HoopDreams</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$2,780</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-amber-600 font-bold mr-2">3.</span>
                    <span className="text-white">BballPro</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$2,340</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-2">4.</span>
                    <span className="text-white">SlamDunk</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$1,950</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-2">5.</span>
                    <span className="text-white">ThreePointer</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$1,720</span>
                </div>
              </div>
            </div>

            {/* Soccer Rankings */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                  <span className="text-green-400 text-lg">⚽</span>
                </div>
                <h4 className="text-lg font-semibold text-white">Soccer Leaders</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-bold mr-2">1.</span>
                    <span className="text-white">GoalGetter</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$2,890</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-300 font-bold mr-2">2.</span>
                    <span className="text-white">FootballFan</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$2,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-amber-600 font-bold mr-2">3.</span>
                    <span className="text-white">PitchPerfect</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$2,100</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-2">4.</span>
                    <span className="text-white">WorldCupWin</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$1,830</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-bold mr-2">5.</span>
                    <span className="text-white">KickMaster</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">+$1,560</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;