export interface League {
    id: string;
    name: string;
    sport: string;
    icon: string;
    isLive?: boolean;
    subcategories: string[];
}

export interface BetSelection {
  h2h?: string;
  spread?: string;
  total?: string;
}
export interface OutComesType{
    _id: string;
    name: string;
    price: number;
}
export interface MarketType {
    _id:string;
    key: string;
    outcomes:OutComesType[];
}
export interface BookMakerType{
    _id: string;
    key: string;
    title: string;
    markets: MarketType[];
}
export interface SportEvent {
    _id: string;
    id:string;
    sport_key: string;
    sport_title: string;
    home_team: string;
    away_team: string;
    commence_time: Date;
    bookmakers: BookMakerType[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Match {
    id: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    homeOdds: number;
    awayOdds: number;
    isLive?: boolean;
    time?: string;
    homeScore?: number;
    awayScore?: number;
}

export interface BetType {
    id: string;
    name: string;
    isActive: boolean;
}


export interface Match {
    id: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    homeOdds: number;
    awayOdds: number;
    isLive?: boolean;
    time?: string;
    homeScore?: number;
    awayScore?: number;
}

export interface BetType {
    id: string;
    name: string;
    isActive: boolean;
}

export interface BetSlipItem {
    eventId: string;
    eventName: string;
    selection: string;
    odds: number;
    stake: number;
}


export interface BetPlace {
    oddId: string;
    bookId:string;
    marketId:string;
    outcomeId:string;
    amount: number;
}