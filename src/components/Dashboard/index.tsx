import React, { useState, useCallback } from 'react';
import { Card, Space, Typography, List, Tag, message } from 'antd';
import axios from 'axios';
import MainLayout from '../CustomComponents/MainLayout';
import BetForm from './BetForm';
import Betslip, { BetslipItem } from './Betslip';

const { Text } = Typography;

interface BetPlacementData {
  betId: string;
  betName: string;
  amount: number;
  pairIndex: number;
  siteName: string;
}

const BET_SITES = [
  {name: "Action", skin: "Action"}
, {name: "Godds", skin: "Godds"}
, {name: "Strikerich", skin: "Strikerich"}
, {name: "Highroller", skin: "Highroller"}
] as const;

const Dashboard: React.FC = () => {
  const [placedBets, setPlacedBets] = useState<BetPlacementData[]>([]);
  const [betslipItems, setBetslipItems] = useState<BetslipItem[]>([]);
  const [placingAllBets, setPlacingAllBets] = useState(false);

  const handleBetPlaced = useCallback((betData: BetPlacementData) => {
    setPlacedBets(prevBets => [...prevBets, betData]);
  }, []);

  // Betslip operations
  const handleAddToBetslip = useCallback((betData: {
    betName: string;
    siteName: string;
    siteSkin: string;
    odds?: string;
    points?: number;
    betData: any;
  }) => {
    const id = `${betData.siteName}-${Date.now()}-${Math.random()}`;
    const newItem: BetslipItem = {
      id,
      betName: betData.betName,
      siteName: betData.siteName,
      siteSkin: betData.siteSkin,
      odds: betData.odds,
      points: betData.points,
      amount: 0,
      betData: betData.betData
    };
    
    setBetslipItems(prev => [...prev, newItem]);
    message.success(`Added "${betData.betName}" to betslip`);
  }, []);

  const handleRemoveFromBetslip = useCallback((id: string) => {
    setBetslipItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleUpdateBetslipAmount = useCallback((id: string, amount: number) => {
    setBetslipItems(prev => prev.map(item => 
      item.id === id ? { ...item, amount } : item
    ));
  }, []);

  const handleClearBetslip = useCallback(() => {
    setBetslipItems([]);
    message.info('Betslip cleared');
  }, []);

  const handlePlaceAllBets = useCallback(async () => {
    if (betslipItems.length === 0) {
      message.warning('No bets in betslip');
      return;
    }

    const invalidBets = betslipItems.filter(item => !item.amount || item.amount <= 0);
    if (invalidBets.length > 0) {
      message.warning('Please enter valid amounts for all bets');
      return;
    }

    setPlacingAllBets(true);
    
    try {
      // Place all bets sequentially
      for (const item of betslipItems) {
        await axios.post('/general/bet', {
          betSlip: item.betData,
          amount: item.amount,
          skin: item.siteSkin
        });
        
        // Add to placed bets
        const placedBet: BetPlacementData = {
          betId: item.id,
          betName: item.betName,
          amount: item.amount,
          pairIndex: 0,
          siteName: item.siteName
        };
        setPlacedBets(prev => [...prev, placedBet]);
      }
      
      message.success(`Successfully placed ${betslipItems.length} bets`);
      setBetslipItems([]); // Clear betslip after successful placement
      
    } catch (error) {
      message.error('Failed to place some bets');
      console.error('Error placing bets:', error);
    } finally {
      setPlacingAllBets(false);
    }
  }, [betslipItems]);

  return (
    <MainLayout>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              <Card title="List of betting sites">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {BET_SITES.map((site, index) => (
                    <BetForm
                      key={index}
                      pairIndex={index}
                      onBetPlaced={handleBetPlaced}
                      onAddToBetslip={handleAddToBetslip}
                      siteName={site.name}
                      siteSkin={site.skin}
                    />
                  ))}
                </Space>
              </Card>

              {placedBets.length > 0 && (
                <Card title="Recent Bets">
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

            {/* Betslip - Right Side */}
            <div className="lg:col-span-1">
              <Betslip
                items={betslipItems}
                onRemoveItem={handleRemoveFromBetslip}
                onUpdateAmount={handleUpdateBetslipAmount}
                onClearAll={handleClearBetslip}
                onPlaceAllBets={handlePlaceAllBets}
                placing={placingAllBets}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;