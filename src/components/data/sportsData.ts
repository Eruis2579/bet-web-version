import { League, Match } from '../types';

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
  { id: '1', league: 'MLB', homeTeam: 'PADRES', awayTeam: 'ORIOLES', homeOdds: 0, awayOdds: 3 },
  { id: '2', league: 'MLB', homeTeam: 'MARLINS', awayTeam: 'GUARDIANS', homeOdds: 0, awayOdds: 3 },
  { id: '3', league: 'MLB', homeTeam: 'TIGERS', awayTeam: 'REDS', homeOdds: 0, awayOdds: 0 },
  { id: '4', league: 'MLB', homeTeam: 'PIRATES', awayTeam: 'NATIONALS', homeOdds: 0, awayOdds: 4 },
  { id: '5', league: 'MLB', homeTeam: 'RED SOX', awayTeam: 'YANKEES', homeOdds: 1, awayOdds: 0 },
  { id: '6', league: 'MLB', homeTeam: 'BLUE JAYS', awayTeam: 'BLUE JAYS', homeOdds: 0, awayOdds: 0 },
  { id: '7', league: 'MLB', homeTeam: 'ANGELS', awayTeam: 'GIANTS', homeOdds: 0, awayOdds: 0 },
  { id: '8', league: 'MLB', homeTeam: 'METS', awayTeam: 'BRAVES', homeOdds: 0, awayOdds: 0 },
  { id: '9', league: 'MLB', homeTeam: 'WHITE SOX', awayTeam: 'ATHLETICS', homeOdds: 0, awayOdds: 0 },
  { id: '10', league: 'MLB', homeTeam: 'RAYS', awayTeam: 'RANGERS', homeOdds: 0, awayOdds: 0 },
  { id: '11', league: 'MLB', homeTeam: 'ROYALS', awayTeam: 'CARDINALS', homeOdds: 0, awayOdds: 0 },
  { id: '12', league: 'MLB', homeTeam: 'CUBS', awayTeam: 'ROCKIES', homeOdds: 0, awayOdds: 0 },
  { id: '13', league: 'MLB', homeTeam: 'BREWERS', awayTeam: 'ASTROS', homeOdds: 0, awayOdds: 0 }
];