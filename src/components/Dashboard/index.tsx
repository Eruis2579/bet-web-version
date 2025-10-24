import React, { useState, useCallback } from 'react';
import { Card, Space, Typography, List, Tag } from 'antd';
import MainLayout from '../CustomComponents/MainLayout';
import BetForm from './BetForm';

const { Text } = Typography;

interface BetPlacementData {
  betId: string;
  betName: string;
  amount: number;
  pairIndex: number;
  siteName: string;
}

const BET_SITES = [{name: "ABC", skin: "Action"}, {name: "DEF", skin: "2"}] as const;

const Dashboard: React.FC = () => {
  const [placedBets, setPlacedBets] = useState<BetPlacementData[]>([]);

  const handleBetPlaced = useCallback((betData: BetPlacementData) => {
    setPlacedBets(prevBets => [...prevBets, betData]);
  }, []);

  // const totalAmount = placedBets.reduce((sum, bet) => sum + bet.amount, 0);
  // const totalBets = placedBets.length;

  return (
    <MainLayout>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="mx-auto px-4">
            <Card title="List of betting sites" className="mb-6">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {BET_SITES.map((site, index) => (
                  <BetForm
                    key={index}
                    pairIndex={index}
                    onBetPlaced={handleBetPlaced}
                    siteName={site.name}
                    siteSkin={site.skin}
                  />
                ))}
              </Space>
            </Card>

            {placedBets.length > 0 && (
              <Card title="Recent Bets" className="mb-6">
                <List
                  dataSource={placedBets.slice(-5).reverse()}
                  renderItem={(bet) => (
                    <List.Item>
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <Text strong>{bet.betName}</Text>
                          <br />
                          <Text type="secondary">Site: {bet.siteName}</Text>
                        </div>
                        <div className="text-right">
                          <Tag color="green">${bet.amount.toFixed(2)}</Tag>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;