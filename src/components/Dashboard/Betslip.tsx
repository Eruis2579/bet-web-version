import React from 'react';
import { Card, List, Button, InputNumber, Space, Typography, Tag, Divider } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export interface BetslipItem {
  id: string;
  betName: string;
  siteName: string;
  siteSkin: string;
  odds?: string;
  points?: number;
  amount: number;
  betData: any; // Store original bet data for placement
}

interface BetslipProps {
  items: BetslipItem[];
  onRemoveItem: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onClearAll: () => void;
  onPlaceAllBets: () => void;
  placing: boolean;
}

const Betslip: React.FC<BetslipProps> = ({ 
  items, 
  onRemoveItem, 
  onUpdateAmount, 
  onClearAll, 
  onPlaceAllBets,
  placing 
}) => {
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalItems = items.length;

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <ShoppingCartOutlined />
          <span>Betslip ({totalItems})</span>
        </div>
      }
      className="h-fit sticky top-4"
      extra={
        totalItems > 0 && (
          <Button 
            size="small" 
            onClick={onClearAll}
            danger
            type="text"
          >
            Clear All
          </Button>
        )
      }
    >
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCartOutlined className="text-3xl mb-2 block" />
          <Text type="secondary">Your betslip is empty</Text>
          <br />
          <Text type="secondary" className="text-sm">
            Add bets to get started
          </Text>
        </div>
      ) : (
        <div className="space-y-4">
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item className="!px-0">
                <div className="w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <Text strong className="text-sm">{item.betName}</Text>
                      <br />
                      <Tag color="blue">{item.siteName}</Tag>
                      {item.odds && (
                        <Tag color="green">
                          Odds: {item.odds}
                        </Tag>
                      )}
                    </div>
                    <Button
                      size="small"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onRemoveItem(item.id)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Text className="text-xs">Amount:</Text>
                    <InputNumber
                      size="small"
                      min={0}
                      step={10}
                      value={item.amount}
                      onChange={(value) => onUpdateAmount(item.id, value || 0)}
                      className="flex-1"
                      placeholder="$0"
                    />
                  </div>
                </div>
              </List.Item>
            )}
          />
          
          <Divider className="my-3" />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Text strong>Total Amount:</Text>
              <Text strong className="text-lg">${totalAmount.toFixed(2)}</Text>
            </div>
            
            <Button
              type="primary"
              block
              size="large"
              onClick={onPlaceAllBets}
              loading={placing}
              disabled={totalItems === 0 || totalAmount <= 0}
              className="h-12"
            >
              Place All Bets ({totalItems})
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Betslip;
