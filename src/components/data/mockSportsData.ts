import { SportEvent, League, Match } from '../types';

export const leagues: League[] = [
  {
    id: 'mlb',
    name: 'MLB',
    sport: 'baseball',
    icon: '⚾',
    subcategories: ['MLB', '1st 5 Innings', 'MLB - Props', 'MLB - LIVE']
  },
  {
    id: 'golf',
    name: 'Golf',
    sport: 'golf',
    icon: '⛳',
    subcategories: ['Ryder Cup']
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    sport: 'entertainment',
    icon: '🎭',
    subcategories: ['Lottery Props']
  },
  {
    id: 'nfl',
    name: 'NFL',
    sport: 'football',
    icon: '🏈',
    subcategories: ['NFL - Week 1', 'NFL - Regular Season Wins', 'NFL - Make the Playoffs', 'NFL - Super Bowl LX']
  },
  {
    id: 'live',
    name: 'LIVE',
    sport: 'live',
    icon: '🔴',
    isLive: true,
    subcategories: ['MLB - LIVE']
  },
  {
    id: 'tennis',
    name: 'Tennis',
    sport: 'tennis',
    icon: '🎾',
    subcategories: ['Tennis - Mens', 'Tennis - Womens']
  },
  {
    id: 'wnba',
    name: 'WNBA',
    sport: 'basketball',
    icon: '🏀',
    subcategories: ['WNBA - Futures']
  },
  {
    id: 'mma',
    name: 'MMA',
    sport: 'mma',
    icon: '🥊',
    subcategories: ['UFC Fight Night']
  },
  {
    id: 'cfl',
    name: 'CFL',
    sport: 'football',
    icon: '🏈',
    subcategories: ['CFL - Futures']
  },
  {
    id: 'soccer',
    name: 'Major Soccer',
    sport: 'soccer',
    icon: '⚽',
    subcategories: ['England']
  }
];

export const matches: Match[] = [
  { id: '1', league: 'MLB', homeTeam: 'PADRES', awayTeam: 'ORIOLES', homeOdds: 0, awayOdds: 3, time: 'TOP 2nd', isLive: true },
  { id: '2', league: 'MLB', homeTeam: 'MARLINS', awayTeam: 'GUARDIANS', homeOdds: 0, awayOdds: 3, time: 'BOT 1st', isLive: true },
  { id: '3', league: 'MLB', homeTeam: 'TIGERS', awayTeam: 'REDS', homeOdds: 0, awayOdds: 0, time: 'BOT 2nd', isLive: true },
  { id: '4', league: 'MLB', homeTeam: 'PIRATES', awayTeam: 'NATIONALS', homeOdds: 0, awayOdds: 4, time: '7:01p' },
  { id: '5', league: 'MLB', homeTeam: 'RED SOX', awayTeam: 'YANKEES', homeOdds: 1, awayOdds: 0, time: '7:10p' },
  { id: '6', league: 'MLB', homeTeam: 'BLUE JAYS', awayTeam: 'RAYS', homeOdds: 0, awayOdds: 0, time: '7:15p' },
  { id: '7', league: 'MLB', homeTeam: 'ANGELS', awayTeam: 'GIANTS', homeOdds: 0, awayOdds: 0, time: '7:35p' },
  { id: '8', league: 'MLB', homeTeam: 'METS', awayTeam: 'BRAVES', homeOdds: 0, awayOdds: 0, time: '8:05p' },
  { id: '9', league: 'MLB', homeTeam: 'WHITE SOX', awayTeam: 'ATHLETICS', homeOdds: 1, awayOdds: 0, time: '8:05p' },
  { id: '10', league: 'MLB', homeTeam: 'RANGERS', awayTeam: 'ASTROS', homeOdds: 0, awayOdds: 0, time: '9:40p' },
  { id: '11', league: 'MLB', homeTeam: 'ROYALS', awayTeam: 'CARDINALS', homeOdds: 0, awayOdds: 0, time: '9:40p' },
  { id: '12', league: 'MLB', homeTeam: 'CUBS', awayTeam: 'ROCKIES', homeOdds: 0, awayOdds: 0, time: '9:40p' },
  { id: '13', league: 'MLB', homeTeam: 'BREWERS', awayTeam: 'DODGERS', homeOdds: 0, awayOdds: 0, time: '9:40p' }
];

export const mockSportsEvents: SportEvent[] = [
  {
    id: '1', 
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'PADRES',
    awayTeam: 'ORIOLES',
    startTime: '2025-01-15T19:30:00Z',
    status: 'live',
    odds: { home: 1.50, away: 2.50 },
    isLive: true,
    score: { home: 0, away: 3 }
  },
  {
    id: '2',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'MARLINS',
    awayTeam: 'GUARDIANS',
    startTime: '2025-01-15T19:45:00Z',
    status: 'live',
    odds: { home: 1.75, away: 2.05 },
    isLive: true,
    score: { home: 0, away: 3 }
  },
  {
    id: '3',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'TIGERS',
    awayTeam: 'REDS',
    startTime: '2025-01-15T20:00:00Z',
    status: 'live',
    odds: { home: 1.90, away: 1.90 },
    isLive: true,
    score: { home: 0, away: 0 }
  },
  {
    id: '4',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'PIRATES',
    awayTeam: 'NATIONALS',
    startTime: '2025-01-16T00:01:00Z',
    status: 'upcoming',
    odds: { home: 1.60, away: 2.40 },
    isLive: false
  },
  {
    id: '5',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'RED SOX',
    awayTeam: 'YANKEES',
    startTime: '2025-01-16T00:10:00Z',
    status: 'upcoming',
    odds: { home: 2.10, away: 1.70 },
    isLive: false
  },
  {
    id: '6',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'BLUE JAYS',
    awayTeam: 'RAYS',
    startTime: '2025-01-16T00:15:00Z',
    status: 'upcoming',
    odds: { home: 1.85, away: 1.95 },
    isLive: false
  },
  {
    id: '7',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'ANGELS',
    awayTeam: 'GIANTS',
    startTime: '2025-01-16T00:35:00Z',
    status: 'upcoming',
    odds: { home: 2.20, away: 1.65 },
    isLive: false
  },
  {
    id: '8',
    sport: 'Baseball',
    league: 'MLB',
    homeTeam: 'METS',
    awayTeam: 'BRAVES',
    startTime: '2025-01-16T01:05:00Z',
    status: 'upcoming',
    odds: { home: 1.95, away: 1.85 },
    isLive: false
  }
];

export const sportsCategories = leagues.map(league => ({
  name: league.name,
  key: league.id,
  icon: league.icon,
  isLive: league.isLive
}));