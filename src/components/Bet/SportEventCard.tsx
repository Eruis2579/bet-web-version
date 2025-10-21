import React from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { SportEvent } from '../types';
import { BetSelection } from '../types';

const { Text } = Typography;

interface SportEventCardProps {
  event: SportEvent;
  value: BetSelection;
  setValue: (value: BetSelection) => void;
  isMobile?: boolean;
}

const Moneyline = ({ event, onSelect }: { event: any, onSelect: (value: string) => void }) => {
  let new_home: any = {};
  let new_away: any = {};
  const book = event?.bookmakers[0];
  const line = book?.markets?.find((v: any) => v.key === "h2h"); // use find instead of filter
  if (line) {
    const home_outcome = line?.outcomes?.find((v: any) => v?.name === event?.home_team);
    if (home_outcome) {
      new_home = {
        eventId: event?._id,
        bookId: book?.key,
        lineId: line?.key || "h2h",
        outcomeId: home_outcome?.name || event?.home_team,
        odds: home_outcome?.price,
        homeTeam: event?.home_team,
        awayTeam: event?.away_team
      };
    }
    const away_outcome = line?.outcomes?.find((v: any) => v?.name === event?.away_team);
    if (away_outcome) {
      new_away = {
        eventId: event?._id,
        bookId: book?.key,
        lineId: line?.key || "h2h",
        outcomeId: away_outcome?.name || event?.away_team,
        odds: away_outcome?.price,
        homeTeam: event?.home_team,
        awayTeam: event?.away_team
      };
    }
    return <div>
      <Text className="text-xs text-gray-400 block mb-2">MONEYLINE</Text>
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="bg-slate-700 hover:bg-emerald-600 border-slate-600 hover:border-emerald-500 text-white"
          style={{
            background: '#334155',
            borderColor: '#475569',
            color: 'white',
            height: 'auto',
            padding: '8px'
          }}
          onClick={() => onSelect(new_home.eventId + "__" + new_home.bookId + "__" + new_home.lineId + "__" + new_home.outcomeId + "__" + new_home.odds + "__" + new_home.homeTeam + "__" + new_home.awayTeam)}
        >
          <div className="text-center w-full">
            <Text className="text-xs text-gray-300 block mb-2">{event.home_team}</Text>
            <Text className="font-bold text-[#00C46C]">{!!new_home ? new_home.odds : ""}</Text>
            {/* <Select
              style={{ width: '100%' }}
              allowClear
              options={
                new_home.map((v: any) => ({
                  value: v.eventId + "__" + v.bookId + "__" + v.lineId + "__" + v.outcomeId + "__" + v.odds + "__" + v.homeTeam + "__" + v.awayTeam,
                  label: <Text className={`font-bold text-[#00C46C]`}>{v.odds}</Text>
                }))
              }
              value={isHome ? value.h2h : undefined}
              onChange={(value) => {
                onSelect(value);
              }}
              disabled={(!!value.h2h || !!value.spread || !!value.total) && !isHome}
            /> */}
          </div>
        </Button>
        <Button
          className="bg-slate-700 hover:bg-orange-600 border-slate-600 hover:border-orange-500 text-white"
          style={{
            background: '#334155',
            borderColor: '#475569',
            color: 'white',
            height: 'auto',
            padding: '8px'
          }}
          onClick={() => onSelect(new_away.eventId + "__" + new_away.bookId + "__" + new_away.lineId + "__" + new_away.outcomeId + "__" + new_away.odds + "__" + new_away.homeTeam + "__" + new_away.awayTeam)}
        >
          <div className="text-center w-full">
            <Text className="text-xs text-gray-300 block mb-2">{event.away_team}</Text>
            <Text className="font-bold text-[#FF8C3A]">{!!new_away ? new_away.odds : ""}</Text>
            {/* <Select
              allowClear
              style={{ width: '100%' }}
              options={
                new_away.map((v: any) => ({
                  value: v.eventId + "__" + v.bookId + "__" + v.lineId + "__" + v.outcomeId + "__" + v.odds + "__" + v.homeTeam + "__" + v.awayTeam,
                  label: <Text className={`font-bold text-[#FF8C3A]`}>{v.odds}</Text>
                }))
              }
              value={isAway ? value.h2h : undefined}
              onChange={(value) => {
                onSelect(value);
              }}
              disabled={(!!value.h2h || !!value.spread || !!value.total) && !isAway}
            /> */}
          </div>
        </Button>
      </div>
    </div>
  }
}
const Spread = ({ event, onSelect }: { event: any, onSelect: (value: string) => void }) => {
  let new_home1: any = {};
  let new_away1: any = {};
  const book = event?.bookmakers[0];
  const line = book?.markets?.find((v: any) => v.key === "spreads"); // use find instead of filter
  if (line) {
    const home_outcome = line?.outcomes?.find((v: any) => v?.name === event?.home_team);
    if (home_outcome) {
      new_home1 = {
        eventId: event?._id,
        bookId: book?.key,
        lineId: line?.key || "spreads",
        outcomeId: home_outcome?.name || event?.home_team,
        odds: home_outcome?.price,
        point: home_outcome?.point,
        homeTeam: event?.home_team,
        awayTeam: event?.away_team
      };
    }
    const away_outcome = line?.outcomes?.find((v: any) => v?.name === event?.away_team);
    if (away_outcome) {
      new_away1 = {
        eventId: event?._id,
        bookId: book?.key,
        lineId: line?.key || "spreads",
        outcomeId: away_outcome?.name || event?.away_team,
        odds: away_outcome?.price,
        point: away_outcome?.point,
        homeTeam: event?.home_team,
        awayTeam: event?.away_team
      };
    }
    return <div>
      <Text className="text-xs text-gray-400 block mb-2">SPREAD</Text>
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="bg-slate-700 hover:bg-blue-600 border-slate-600 hover:border-blue-500 text-white"
          style={{
            background: '#334155',
            borderColor: '#475569',
            color: 'white',
            height: 'auto',
            padding: '8px'
          }}
          onClick={() => onSelect(new_home1.eventId + "__" + new_home1.bookId + "__" + new_home1.lineId + "__" + new_home1.outcomeId + "__" + new_home1.odds + "__" + new_home1.point + "__" + new_home1.homeTeam + "__" + new_home1.awayTeam)}
        >
          <div className="text-center w-full">
            <Text className="text-xs text-gray-300 block mb-2">{event.home_team}</Text>
            <Text className={`font-bold text-[#00C46C]`}>{new_home1.point > 0 ? `+${new_home1.point}` : `${new_home1.point}`} ({new_home1.odds})</Text>
            {/* <Select
              style={{ width: '100%' }}
              allowClear
              options={
                new_home.map((v: any) => ({
                  value: v.eventId + "__" + v.bookId + "__" + v.lineId + "__" + v.outcomeId + "__" + v.odds + "__" + v.point + "__" + v.homeTeam + "__" + v.awayTeam,
                  label: <Text className={`font-bold text-[#00C46C]`}>{v.point > 0 ? `+${v.point}` : `${v.point}`} ({v.odds})</Text>
                }))
              }
              value={isHome ? value.spread : undefined}
              onChange={(value) => {
                onSelect(value);
              }}
              disabled={(!!value.h2h || !!value.spread || !!value.total) && !isHome}
            /> */}
          </div>
        </Button>
        <Button
          className="bg-slate-700 hover:bg-purple-600 border-slate-600 hover:border-purple-500 text-white"
          style={{
            background: '#334155',
            borderColor: '#475569',
            color: 'white',
            height: 'auto',
            padding: '8px'
          }}
          onClick={() => onSelect(new_away1.eventId + "__" + new_away1.bookId + "__" + new_away1.lineId + "__" + new_away1.outcomeId + "__" + new_away1.odds + "__" + new_away1.point + "__" + new_away1.homeTeam + "__" + new_away1.awayTeam)}
        >
          <div className="text-center w-full">
            <Text className="text-xs text-gray-300 block mb-2">{event.away_team}</Text>
            <Text className={`font-bold text-[#FF8C3A]`}>{new_away1.point > 0 ? `+${new_away1.point}` : `${new_away1.point}`} ({new_away1.odds})</Text>
            {/* <Select
              style={{ width: '100%' }}
              allowClear
              options={
                new_away.map((v: any) => ({
                  value: v.eventId + "__" + v.bookId + "__" + v.lineId + "__" + v.outcomeId + "__" + v.odds + "__" + v.point + "__" + v.homeTeam + "__" + v.awayTeam,
                  label: <Text className={`font-bold text-[#FF8C3A]`}>{v.point > 0 ? `+${v.point}` : `${v.point}`} ({v.odds})</Text>
                }))
              }
              value={isAway ? value.spread : undefined}
              onChange={(value) => {
                onSelect(value);
              }}
              disabled={(!!value.h2h || !!value.spread || !!value.total) && !isAway}
            /> */}
          </div>
        </Button>
      </div>
    </div>
  }
}
const Total = ({ event, onSelect }: { event: any, onSelect: (value: string) => void }) => {
  let over: any = {};
  let under: any = {};
  const book = event?.bookmakers[0];
  const line = book?.markets?.find((v: any) => v.key === "totals"); // use find instead of filter
  if (line) {
    const over_outcome = line?.outcomes?.find((v: any) => v?.name === 'Over');
    if (over_outcome) {
      over = {
        eventId: event?._id,
        bookId: book?.key,
        lineId: line?.key || "totals",
        outcomeId: over_outcome?.name || 'Over',
        odds: over_outcome?.price,
        point: over_outcome?.point,
        homeTeam: event?.home_team,
        awayTeam: event?.away_team
      };
    }
    const under_outcome = line?.outcomes?.find((v: any) => v?.name === 'Under');
    if (under_outcome) {
      under = {
        eventId: event?._id,
        bookId: book?.key,
        lineId: line?.key || "totals",
        outcomeId: under_outcome?.name || 'Under',
        odds: under_outcome?.price,
        point: under_outcome?.point,
        homeTeam: event?.home_team,
        awayTeam: event?.away_team
      };
    }
    return <div>
      <Text className="text-xs text-gray-400 block mb-2">TOTAL</Text>
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="bg-slate-700 hover:bg-green-600 border-slate-600 hover:border-green-500 text-white"
          style={{
            background: '#334155',
            borderColor: '#475569',
            color: 'white',
            height: 'auto',
            padding: '8px'
          }}
          onClick={() => onSelect(over.eventId + "__" + over.bookId + "__" + over.lineId + "__" + over.outcomeId + "__" + over.odds + "__" + over.point + "__" + over.homeTeam + "__" + over.awayTeam)}
        >
          <div className="text-center w-full">
            <Text className="text-xs text-gray-300 block mb-2">OVER</Text>
            <Text className={`font-bold text-[#00C46C]`}>{over.point > 0 ? `+${over.point}` : `${over.point}`} ({over.odds})</Text>
            {/* <Select
              style={{ width: '100%' }}
              allowClear
              options={
                over.map((v: any) => ({
                  value: v.eventId + "__" + v.bookId + "__" + v.lineId + "__" + v.outcomeId + "__" + v.odds + "__" + v.point + "__" + v.homeTeam + "__" + v.awayTeam,
                  label: <Text className={`font-bold text-[#00C46C]`}>{v.point > 0 ? `+${v.point}` : `${v.point}`} ({v.odds})</Text>
                }))
              }
              value={isOver ? value.total : undefined}
              onChange={(value) => {
                onSelect(value);
              }}
              disabled={(!!value.total || !!value.spread || !!value.h2h) && !isOver}
            /> */}
          </div>
        </Button>
        <Button
          className="bg-slate-700 hover:bg-red-600 border-slate-600 hover:border-red-500 text-white"
          style={{
            background: '#334155',
            borderColor: '#475569',
            color: 'white',
            height: 'auto',
            padding: '8px'
          }}
          onClick={() => onSelect(under.eventId + "__" + under.bookId + "__" + under.lineId + "__" + under.outcomeId + "__" + under.odds + "__" + under.point + "__" + under.homeTeam + "__" + under.awayTeam)}
        >
          <div className="text-center w-full">
            <Text className="text-xs text-gray-300 block mb-2">UNDER</Text>
            <Text className={`font-bold text-[#FF3B5C]`}>{under.point > 0 ? `+${under.point}` : `${under.point}`} ({under.odds})</Text>
            {/* <Select
              style={{ width: '100%' }}
              allowClear
              options={
                under.map((v: any) => ({
                  value: v.eventId + "__" + v.bookId + "__" + v.lineId + "__" + v.outcomeId + "__" + v.odds + "__" + v.point + "__" + v.homeTeam + "__" + v.awayTeam,
                  label: <Text className={`font-bold text-[#FF3B5C]`}>{v.point > 0 ? `+${v.point}` : `${v.point}`} ({v.odds})</Text>
                }))
              }
              value={isUnder ? value.total : undefined}
              onChange={(value) => {
                onSelect(value);
              }}
              disabled={(!!value.total || !!value.spread || !!value.h2h) && !isUnder}
            /> */}
          </div>
        </Button>
      </div>
    </div>
  }
}
export const SportEventCard: React.FC<SportEventCardProps> = ({
  event,
  setValue
}) => {
  const formatTime = (timeString: Date) => {
    const date = new Date(timeString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      // Show only the time (e.g., "3:45 PM")
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    // Show date if it's not today (e.g., "Sep 3" or "09/03/2025")
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });;
  };


  return (
    <Card
      className="hover:border-emerald-500 transition-all"
      style={{
        background: '#1e293b',
        borderColor: '#334155',
        color: 'white',
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <Space>
          <Text className="text-sm font-semibold text-emerald-400">{event.sport_title}</Text>
        </Space>
        <div className="text-right">
          <Text className="text-xs text-gray-400">{formatTime(event.commence_time)}</Text>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <Space size="small">
            <div className={`w-6 h-6 bg-red-600 rounded-full flex items-center justify-center`}>
              <Text className="text-white text-xs font-bold">
                {event.home_team.charAt(0)}
              </Text>
            </div>
            <Text className="text-sm font-semibold text-white">{event.home_team}</Text>
          </Space>
          <Text className="text-xs text-white">Home</Text>
        </div>
        <div className="flex items-center justify-between">
          <Space size="small">
            <div className={`w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center`}>
              <Text className="text-white text-xs font-bold">
                {event.away_team.charAt(0)}
              </Text>
            </div>
            <Text className="text-sm font-semibold text-white">{event.away_team}</Text>
          </Space>
          <Text className="text-xs text-white">Away</Text>
        </div>
      </div>

      <div className="space-y-3">
        <Moneyline event={event} onSelect={(value) => setValue({ h2h: value, spread: undefined, total: undefined })} />
        <Spread event={event} onSelect={(value) => setValue({ h2h: undefined, spread: value, total: undefined })} />
        <Total event={event} onSelect={(value) => setValue({ h2h: undefined, spread: undefined, total: value })} />
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700">
        <Space size="small">
          <ClockCircleOutlined className="text-red-400" />
          <Text className="text-xs text-red-400">{event.sport_title}</Text>
        </Space>
      </div>
    </Card>
  );
};