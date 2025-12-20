import React from 'react';
import { InputNumber, Switch, Space, Typography, Row, Col, Select } from 'antd';

const { Text } = Typography;

interface BetControlPanelProps {
  masterBetAmount: number;
  pointTolerance: number;
  priceTolerance: number;
  confirmMode: boolean;
  selectedService: string;
  selectedMarket: string;
  onMasterBetAmountChange: (value: number | null) => void;
  onPointToleranceChange: (value: number | null) => void;
  onPriceToleranceChange: (value: number | null) => void;
  onConfirmModeChange: (checked: boolean) => void;
  onServiceFilterChange: (value: string) => void;
  onMarketFilterChange: (value: string) => void;
}

const BetControlPanel: React.FC<BetControlPanelProps> = ({
  masterBetAmount,
  pointTolerance,
  priceTolerance,
  confirmMode,
  selectedService,
  selectedMarket,
  onMasterBetAmountChange,
  onPointToleranceChange,
  onPriceToleranceChange,
  onConfirmModeChange,
  onServiceFilterChange,
  onMarketFilterChange,
}) => {
  const services = [
    { value: 'all', label: 'All' },
    { value: 'abcwager', label: 'Abcwager' },
    { value: 'action', label: 'Action' },
    { value: 'betwindycity', label: 'Betwindycity' },
    { value: 'fesster', label: 'Fesster' },
    { value: 'godds', label: 'Godds' },
    { value: 'strikerich', label: 'Strikerich' },
    { value: 'betservice365', label: 'Betservice365' },
  ];

  const markets = [
    { value: 'all', label: 'All' },
    { value: 'moneyline', label: 'Moneyline' },
    { value: 'spread', label: 'Spread' },
    { value: 'total', label: 'Total' },
  ];
  return (
    <div className="w-full p-6 border border-slate-700/50 rounded-xl mb-4 bg-slate-700/30 backdrop-blur-sm shadow-lg">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong className="text-slate-200">Master Bet Amount ($):</Text>
            <InputNumber
              value={masterBetAmount}
              onChange={onMasterBetAmountChange}
              min={0}
              step={10}
              className="w-full dark-input"
              controls
              style={{ 
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong className="text-slate-200">Point Tolerance:</Text>
            <InputNumber
              value={pointTolerance}
              onChange={onPointToleranceChange}
              min={0}
              step={0.1}
              precision={1}
              className="w-full dark-input"
              controls
              style={{ 
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong className="text-slate-200">Price Tolerance (Cents):</Text>
            <InputNumber
              value={priceTolerance}
              onChange={onPriceToleranceChange}
              min={0}
              step={1}
              className="w-full dark-input"
              controls
              style={{ 
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong className="text-slate-200">Confirm Mode</Text>
            <Switch
              checked={confirmMode}
              onChange={onConfirmModeChange}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              className="dark-switch"
            />
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} align="middle" className="mt-4">
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong className="text-slate-200">Service Filter:</Text>
            <Select
              value={selectedService}
              onChange={onServiceFilterChange}
              options={services}
              className="w-full dark-select"
              style={{
                width: '100%'
              }}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong className="text-slate-200">Market Filter:</Text>
            <Select
              value={selectedMarket}
              onChange={onMarketFilterChange}
              options={markets}
              className="w-full dark-select"
              style={{
                width: '100%'
              }}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default BetControlPanel;

