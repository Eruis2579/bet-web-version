import React from 'react';
import { InputNumber, Switch, Space, Typography, Row, Col } from 'antd';

const { Text } = Typography;

interface BetControlPanelProps {
  masterBetAmount: number;
  pointTolerance: number;
  priceTolerance: number;
  confirmMode: boolean;
  onMasterBetAmountChange: (value: number | null) => void;
  onPointToleranceChange: (value: number | null) => void;
  onPriceToleranceChange: (value: number | null) => void;
  onConfirmModeChange: (checked: boolean) => void;
}

const BetControlPanel: React.FC<BetControlPanelProps> = ({
  masterBetAmount,
  pointTolerance,
  priceTolerance,
  confirmMode,
  onMasterBetAmountChange,
  onPointToleranceChange,
  onPriceToleranceChange,
  onConfirmModeChange,
}) => {
  return (
    <div className="w-full p-4  border-2  rounded-lg mb-4">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong>Master Bet Amount ($):</Text>
            <InputNumber
              value={masterBetAmount}
              onChange={onMasterBetAmountChange}
              min={0}
              step={10}
              className="w-full"
              controls
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong>Point Tolerance:</Text>
            <InputNumber
              value={pointTolerance}
              onChange={onPointToleranceChange}
              min={0}
              step={0.1}
              precision={1}
              className="w-full"
              controls
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong>Price Tolerance (Cents):</Text>
            <InputNumber
              value={priceTolerance}
              onChange={onPriceToleranceChange}
              min={0}
              step={1}
              className="w-full"
              controls
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size="small" className="w-full">
            <Text strong>Confirm Mode</Text>
            <Switch
              checked={confirmMode}
              onChange={onConfirmModeChange}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default BetControlPanel;

