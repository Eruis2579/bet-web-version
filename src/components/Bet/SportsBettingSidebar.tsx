import React from 'react';
import { useState } from 'react';
import { Collapse, Space, Typography } from 'antd';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { BetTypeLeague } from '../data/betTypeData';
const { Panel } = Collapse;
const { Text } = Typography;
const icons = [{
  id: 'Football',
  icon: '🏈',
}, {
  id: 'Auto',
  icon: '🚗',
}, {
  id: 'Baseball',
  icon: '⚾',
}, {
  id: 'Basketball',
  icon: '🏀',
}, {
  id: 'Hockey',
  icon: '🏒',
}, {
  id: 'Lacrosse',
  icon: '🥍', // corrected to lacrosse stick & ball
}, {
  id: 'MMA',
  icon: '🥊',
}, {
  id: 'Soccer',
  icon: '⚽',
}, {
  id: 'Table Tennis',
  icon: '🏓',
}, {
  id: 'Golf',
  icon: '⛳',
}, {
  id: 'Aussie Rules',
  icon: '🏉', // rugby football emoji (closest fit for AFL)
}, {
  id: 'Cricket',
  icon: '🏏',
}, {
  id: 'Rugby League',
  icon: '🏉',
}, {
  id: 'American Football',
  icon: '⚽',
}, {
  id: 'Ice Hockey',
  icon: '🏒',
}, {
  id: 'Politics',
  icon: '🏛️', // classical building
}, {
  id: 'Mixed Martial Arts',
  icon: '🥋', // martial arts uniform (karate gi)
}, {
  id: 'Tennis',
  icon: '🎾',
}, {
  id: 'Boxing',
  icon: '🥊',
}];

interface SportsBettingSidebarProps {
  collapsed?: boolean;
  betTypeLeagues: BetTypeLeague[];
  onCollapse?: (collapsed: boolean) => void;
  selectedSubcategories: string;
  setSelectedSubcategories: (subcategory: string) => void;
  isMobile?: boolean;
}

export const SportsBettingSidebar: React.FC<SportsBettingSidebarProps> = ({
  collapsed = false,
  betTypeLeagues,
  selectedSubcategories,
  setSelectedSubcategories,
  isMobile = false
}) => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories(subcategory);
    // Auto-collapse sidebar on mobile after selection
    if (isMobile) {
      // You can add a callback here to collapse the sidebar on mobile
    }
  };

  // Mobile sidebar overlay
  if (isMobile && !collapsed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden">
        <div className="fixed left-0 top-0 h-full w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto">
          <div className="bg-slate-900 text-white px-4 py-3 font-semibold text-center border-b border-slate-700 flex items-center justify-between">
            <span>LEAGUES</span>
            <button 
              onClick={() => {/* Add collapse callback */}}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
          <Collapse
            activeKey={activeKeys}
            onChange={setActiveKeys}
            ghost
            expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
            className="bg-slate-800"
            style={{ background: '#1e293b' }}
          >
            {betTypeLeagues.map((league) => (
              <Panel
                key={league._id}
                header={
                  <Space className="text-white">
                    <Text className="font-semibold text-white">{icons.find(icon => icon.id === league._id)?.icon} {league._id}</Text>
                  </Space>
                }
                className={league._id === 'live' ? 'bg-red-600' : 'bg-slate-700'}
                style={{
                  background: '#334155',
                  borderColor: '#475569'
                }}
              >
                <div className="bg-slate-600" style={{ background: '#475569' }}>
                  {league.sports.map((sport, index) => (
                    <div onClick={() => handleSubcategoryChange(sport._id)}  key={index} title={sport.title} className={`flex items-center px-4 py-2 hover:bg-blue-500 cursor-pointer ${selectedSubcategories === sport._id && 'bg-blue-600'}`}>
                      <Text  className="text-sm text-gray-200">{sport.title}</Text>
                    </div>
                  ))}
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed left-0 bg-slate-800 border-r border-slate-700 overflow-y-auto z-20 transition-all duration-300 ${
        collapsed ? 'w-0' : 'w-80'
      }`}
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="bg-slate-900 text-white px-4 py-3 font-semibold text-center border-b border-slate-700" style={{ background: '#0f172a' }}>
        {collapsed ? 'L' : 'LEAGUES'}
      </div>

      {!collapsed && (
        <Collapse
          activeKey={activeKeys}
          onChange={setActiveKeys}
          ghost
          expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
          className="bg-slate-800"
          style={{ background: '#1e293b' }}
        >
          {betTypeLeagues.map((league) => (
            <Panel
              key={league._id}
              header={
                <Space className="text-white">
                  <Text className="font-semibold text-white">{icons.find(icon => icon.id === league._id)?.icon} {league._id}</Text>
                </Space>
              }
              className={league._id === 'live' ? 'bg-red-600' : 'bg-slate-700'}
              style={{
                background: '#334155',
                borderColor: '#475569'
              }}
            >
              <div className="bg-slate-600" style={{ background: '#475569' }}>
                {league.sports.map((sport, index) => (
                  <div onClick={() => handleSubcategoryChange(sport._id)}  key={index} title={sport.title} className={`flex items-center px-4 py-2 hover:bg-blue-500 cursor-pointer ${selectedSubcategories === sport._id && 'bg-blue-600'}`}>
                    <Text  className="text-sm text-gray-200">{sport.title}</Text>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};