import React from 'react';
import { Button, Space } from 'antd';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getContextId } from '../../services/betService';

export interface BetType {
  id: string;
  name: string;
}

interface BetTypeSubheaderProps {
  betTypes: BetType[];
  activeBetType: string;
  onBetTypeChange: (betTypeId: string) => void;
}

export const BetTypeSubheader: React.FC<BetTypeSubheaderProps> = ({
  betTypes,
  activeBetType,
  onBetTypeChange
}) => {
  const {user} = useAuth();

  const handleConnect = async () => {
    const contextId = await getContextId();
    const url = `https://ui.sharpsports.io/link/${contextId}`
    window.location.href = url;
  };
  return (
    <div className="bg-slate-700 border-b border-slate-600 px-6 py-3 sticky top-16 z-30">
      <div className="flex items-center justify-between">
        <Space size="small">
          {betTypes.map((betType) => (
            <Button
              key={betType.id}
              type={activeBetType === betType.id ? 'primary' : 'default'}
              onClick={() => onBetTypeChange(betType.id)}
              className={`font-medium ${activeBetType === betType.id
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-slate-600 border-slate-500 text-gray-300 hover:bg-slate-500 hover:border-slate-400'
                }`}
              style={{
                background: activeBetType === betType.id ? '#059669' : '#475569',
                borderColor: activeBetType === betType.id ? '#059669' : '#64748b',
                color: activeBetType === betType.id ? 'white' : '#d1d5db'
              }}
            >
              {betType.name}
            </Button>
          ))}
        </Space>

        {
          !user?.connected && (
            <Button
              type="primary"
              className="flex items-center bg-orange-500 hover:bg-orange-600 border-orange-500 font-semibold"
              style={{
                background: '#f97316',
                borderColor: '#f97316'
              }}
              onClick={handleConnect}
            >
              <Plus className="w-4 h-4" />
              Connect
            </Button>
          )
        }
      </div>
    </div>
  );
};