import MainLayout from "../CustomComponents/MainLayout";
import { useEffect, useState } from 'react';
import { SportsBettingSidebar } from "./SportsBettingSidebar";
import { SportEventCard } from './SportEventCard';
import { BetSlip } from './BetSlip';
import { BetSlipItem, SportEvent, BetSelection } from '../types';
import { betPlace, getLeagues, getOdds } from '../../services/betService';
import { BetTypeLeague } from "../data/betTypeData";
import { useAuth } from '../../contexts/AuthContext';

export default function () {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [betSlipItems, setBetSlipItems] = useState<BetSlipItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SportEvent[]>([]);
  const [betTypeLeagues, setBetTypeLeagues] = useState<BetTypeLeague[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [pullToRefresh, setPullToRefresh] = useState({ startY: 0, isPulling: false, pullDistance: 0 });
  const [value, setValue] = useState<BetSelection>({
    h2h: undefined,
    spread: undefined,
    total: undefined,
  });
  const {refreshToken} = useAuth();
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setShowBetSlip(false);
      } else {
        setSidebarCollapsed(false);
        setShowBetSlip(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile pull-to-refresh functionality
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setPullToRefresh(prev => ({ ...prev, startY: e.touches[0].clientY }));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && pullToRefresh.startY > 0) {
        const currentY = e.touches[0].clientY;
        const pullDistance = Math.max(0, currentY - pullToRefresh.startY);

        if (pullDistance > 50) {
          setPullToRefresh(prev => ({ ...prev, isPulling: true, pullDistance }));
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullToRefresh.isPulling && pullToRefresh.pullDistance > 100) {
        // Trigger refresh
        try {
          if (selectedSubcategories) {
            const response = await getOdds(selectedSubcategories);
            setFilteredEvents(response);
          }
          const leaguesResponse = await getLeagues();
          setBetTypeLeagues(leaguesResponse);
        } catch (error) {
          console.error('Refresh failed:', error);
        } 
      }

      setPullToRefresh({ startY: 0, isPulling: false, pullDistance: 0 });
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, selectedSubcategories, pullToRefresh.isPulling, pullToRefresh.pullDistance]);

  // Enhanced mobile bet slip handling
  // useEffect(() => {
  //   if (isMobile && betSlipItems.length > 0 && !showBetSlip) {
  //     // Auto-show bet slip on mobile after a short delay
  //     const timer = setTimeout(() => {
  //       setShowBetSlip(true);
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [betSlipItems.length, isMobile, showBetSlip]);

  useEffect(() => {
    if (selectedSubcategories) getOdds(selectedSubcategories).then((response: any) => {
      setFilteredEvents(response);
      setValue({
        h2h: undefined,
        spread: undefined,
        total: undefined,
      });
    });
  }, [selectedSubcategories]);

  useEffect(() => {
    getLeagues().then((response) => {
      setBetTypeLeagues(response);
    });
  }, []);

  useEffect(() => {
    if (!!value.h2h || !!value.spread || !!value.total) {
      const eventId = value.h2h ?? value.spread ?? value.total;
      if (eventId) {
        let home_team = '', away_team = '', odds = 0, section = '';
        const proposition = eventId.split("__")[2];
        if (proposition == "h2h") {
          home_team = eventId.split("__")[5];
          away_team = eventId.split("__")[6];
          odds = Number(eventId.split("__")[4]) < 0 ? (100 / Math.abs(Number(eventId.split("__")[4]))) + 1 : (Math.abs(Number(eventId.split("__")[4])) / 100) + 1;
          section = eventId.split("__")[3] + " ML";
        }
        if (proposition == "spreads") {
          home_team = eventId.split("__")[6];
          away_team = eventId.split("__")[7];
          odds = Number(eventId.split("__")[4]) < 0 ? (100 / Math.abs(Number(eventId.split("__")[4]))) + 1 : (Math.abs(Number(eventId.split("__")[4])) / 100) + 1;
          const position = Number(eventId.split("__")[5]);
          section = eventId.split("__")[3] + " " + `${position > 0 ? '+' : ''} ${position}`;
        }
        if (proposition == "totals") {
          home_team = eventId.split("__")[6];
          away_team = eventId.split("__")[7];
          odds = Number(eventId.split("__")[4]) < 0 ? (100 / Math.abs(Number(eventId.split("__")[4]))) + 1 : (Math.abs(Number(eventId.split("__")[4])) / 100) + 1;
          const position = Number(eventId.split("__")[5]);
          section = eventId.split("__")[3] + " " + `${position > 0 ? '+' : ''} ${position}`;
        }
        handleAddToBetSlip(eventId, home_team, away_team, section, odds);
      }
    } else {
      setBetSlipItems([]);
    }
  }, [value])

  const handlePlaceBet = (data: BetSlipItem[]) => {
    const totalStake = data[0].stake;
    const reqData = data[0].eventId.split("__");
    if (totalStake === 0) {
      window.SM.error('Please enter stake amounts for your selections');
      return;
    }

    betPlace({
      oddId: reqData[0],
      bookId: reqData[1],
      marketId: reqData[2],
      outcomeId: reqData[3],
      amount: totalStake
    })
      .then(() => {
        refreshToken();
        setValue({
          h2h: undefined,
          spread: undefined,
          total: undefined,
        });

        window.SM.success("Bet placed successfully!")
        if (isMobile) {
          setShowBetSlip(false);
        }
      })
      .catch((err) => {
        setValue({
          h2h: undefined,
          spread: undefined,
          total: undefined,
        });
        window.SM.error(err)
      })
  };

  const handleAddToBetSlip = (eventId: string, home_team: string, away_team: string, selection: string, odds: number) => {
    const newItem: BetSlipItem = {
      eventId,
      eventName: `${home_team} vs ${away_team}`,
      selection,
      odds,
      stake: 0 // Default stake
    };

    setBetSlipItems([newItem]);
    window.SM.success(`${selection} added to bet slip`);

    // Auto-show bet slip on mobile when selection is made
    if (isMobile) {
      setShowBetSlip(true);
    }
  };

  const handleUpdateStake = (eventId: string, stake: number) => {
    setBetSlipItems(prev =>
      prev.map(item =>
        item.eventId === eventId ? { ...item, stake } : item
      )
    );
  };

  const toggleBetSlip = () => {
    setShowBetSlip(!showBetSlip);
  };

  const handleMobileSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Auto-close bet slip when opening sidebar on mobile
    if (!sidebarCollapsed && showBetSlip) {
      setShowBetSlip(false);
    }
  };

  return (
    <>
      <MainLayout>
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          {/* Pull to Refresh Indicator */}
          {isMobile && pullToRefresh.isPulling && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white text-center py-2 text-sm font-medium">
              {pullToRefresh.pullDistance > 100 ? 'Release to refresh' : 'Pull to refresh'}
            </div>
          )}

          {/* Mobile Header with Enhanced Navigation */}
          {isMobile && (
            <div className="md:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMobileSidebarToggle}
                    className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white p-2.5 rounded-lg transition-colors duration-200 touch-manipulation"
                    aria-label="Toggle sidebar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div className="text-white font-semibold text-base">Sports Betting</div>
                </div>
                <button
                  onClick={toggleBetSlip}
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 touch-manipulation"
                  aria-label="Open bet slip"
                >
                  <span className="hidden sm:inline">Bet Slip</span>
                  <span className="sm:hidden">Slip</span>
                  {betSlipItems.length > 0 && (
                    <span className="bg-white text-emerald-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                      {betSlipItems.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Subheader with Quick Stats */}
              {betSlipItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Total Stake:</span>
                    <span className="text-white font-semibold">
                      ${betSlipItems.reduce((sum, item) => sum + item.stake, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-300">Potential Win:</span>
                    <span className="text-emerald-400 font-semibold">
                      ${(betSlipItems.reduce((sum, item) => sum + item.stake, 0) *
                        betSlipItems.reduce((product, item) => product * item.odds, 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex">
            {/* Sidebar */}
            <SportsBettingSidebar
              betTypeLeagues={betTypeLeagues}
              collapsed={sidebarCollapsed}
              onCollapse={setSidebarCollapsed}
              selectedSubcategories={selectedSubcategories}
              setSelectedSubcategories={setSelectedSubcategories}
              isMobile={isMobile}
            />

            {/* Main Content Area with Mobile Optimizations */}
            <div className={`flex-1 transition-all duration-300 ${isMobile
                ? 'ml-0'
                : sidebarCollapsed
                  ? 'ml-20'
                  : 'ml-80'
              }`}>
              <div className={`${isMobile ? 'p-3' : 'p-4 sm:p-6 lg:p-8'}`}>
                <div className={`bg-slate-900 rounded-lg ${isMobile ? 'p-3' : 'p-4 sm:p-6'}`} style={{ minHeight: 'calc(100vh - 128px)' }}>
                  {/* Events Count with Mobile Optimization */}
                  <div className={`${isMobile ? 'mb-3' : 'mb-4 sm:mb-6'}`}>
                    <div className="text-gray-400 text-sm sm:text-base flex items-center justify-between">
                      <span>{filteredEvents.length} events available</span>
                      {isMobile && betSlipItems.length > 0 && (
                        <button
                          onClick={toggleBetSlip}
                          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium bg-emerald-400 bg-opacity-10 px-3 py-1 rounded-full transition-colors duration-200"
                        >
                          View Bet Slip ({betSlipItems.length})
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={`grid gap-3 sm:gap-4 ${isMobile
                      ? 'grid-cols-1'
                      : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3'
                    }`}>
                    {filteredEvents.map(event => (
                      <SportEventCard
                        key={event._id}
                        event={event}
                        value={value}
                        setValue={setValue}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bet Slip - Desktop */}
            {!isMobile && (
              <div className="w-80 flex-shrink-0">
                <div className="sticky top-10">
                  <BetSlip
                    betSlipItems={betSlipItems}
                    onUpdateStake={handleUpdateStake}
                    onPlaceBet={handlePlaceBet}
                    onRemoveItem={() => setValue({
                      h2h: undefined,
                      spread: undefined,
                      total: undefined,
                    })}
                    isMobile={false}
                  />
                </div>
              </div>
            )}

            {/* Enhanced Mobile Bet Slip Overlay */}
            {isMobile && showBetSlip && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowBetSlip(false);
                  }
                }}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto">
                  {/* Enhanced Header with Drag Handle */}
                  <div className="flex items-center justify-center mb-3 pb-2">
                    <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <h3 className="text-white text-lg font-semibold">Bet Slip</h3>
                      {betSlipItems.length > 0 && (
                        <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                          {betSlipItems.length} selection{betSlipItems.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowBetSlip(false)}
                      className="text-gray-400 hover:text-white text-2xl p-1 rounded-full hover:bg-slate-700 transition-colors duration-200"
                      aria-label="Close bet slip"
                    >
                      ×
                    </button>
                  </div>

                  {/* Enhanced Bet Slip Content */}
                  <BetSlip
                    betSlipItems={betSlipItems}
                    onUpdateStake={handleUpdateStake}
                    onPlaceBet={handlePlaceBet}
                    onRemoveItem={() => {
                      setValue({
                        h2h: undefined,
                        spread: undefined,
                        total: undefined,
                      });
                      setShowBetSlip(false);
                    }}
                    isMobile={true}
                  />

                  {/* Mobile-Specific Footer with Enhanced Instructions */}
                  <div className="mt-4 pt-3 border-t border-slate-700 text-center">
                    <p className="text-gray-400 text-xs mb-2">
                      Swipe down to close • Tap outside to dismiss
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <span>💡 Quick tip: Double-tap odds to add to slip</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  )
}