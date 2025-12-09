import React, { useState, useCallback, useEffect } from 'react';
import { Card, Space, Typography, Button, Modal, Table, App as AntdApp, Tooltip } from 'antd';
import axios from 'axios';
import MainLayout from '../CustomComponents/MainLayout';
import BetForm from './BetForm';
import BetControlPanel from './BetControlPanel';
import { RedoOutlined } from '@ant-design/icons';

const { Text } = Typography;


interface TelegramResponseData {
  input: string;
  msg: Array<{
    id?: string | number;
    [key: string]: any;
  }>;
}

const Dashboard: React.FC = () => {
  const { message } = AntdApp.useApp();
  

  // Telegram version state
  const [telegramModalVisible, setTelegramModalVisible] = useState<boolean>(false);
  const [telegramResponseData, setTelegramResponseData] = useState<TelegramResponseData | null>(null);
  const [selectedMsgRows, setSelectedMsgRows] = useState<React.Key[]>([]);
  const [placingTelegramBet, setPlacingTelegramBet] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  
  // Control Panel state
  const [masterBetAmount, setMasterBetAmount] = useState<number>(100);
  const [pointTolerance, setPointTolerance] = useState<number>(0.7);
  const [priceTolerance, setPriceTolerance] = useState<number>(20);
  const [confirmMode, setConfirmMode] = useState<boolean>(true);

  // Telegram version handlers

  const handleTelegramBet = useCallback(async () => {
    if (!telegramResponseData) {
      return;
    }

    if (selectedMsgRows.length === 0) {
      message.warning('Please select at least one item');
      return;
    }

    setPlacingTelegramBet(true);
    try {
      const selectedMsgs = telegramResponseData.msg.filter((_, index) =>
        selectedMsgRows.includes(index)
      );

      await axios.post('/general/confirmbet', {
        input: telegramResponseData.input,
        betslips: selectedMsgs
      });

      window.SM.success('Bet placed successfully');
      fetchHistory();
      setTelegramModalVisible(false);
      setTelegramResponseData(null);
      setSelectedMsgRows([]);
    } catch (error: any) {
      window.SM.error(error?.response?.data || 'Failed to place bet');
      fetchHistory();
    } finally {
      setPlacingTelegramBet(false);
    }
  }, [telegramResponseData, selectedMsgRows]);

  const handleTelegramModalClose = useCallback(() => {
    setTelegramModalVisible(false);
    setTelegramResponseData(null);
    setSelectedMsgRows([]);
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get('/general/history');
      if (Array.isArray(response.data)) {
        setHistoryData(response.data.reverse());
      } else {
        setHistoryData([]);
      }
    } catch (error: any) {
      window.SM.error(error?.response?.data || 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Table columns for telegram modal
  const telegramTableColumns = telegramResponseData?.msg && telegramResponseData.msg.length > 0
    ?
    [
      {
        title: "Msg",
        dataIndex: "msg",
        key: "msg",
        render: (text: string) => <Text>{text}</Text>,
      }
    ]
    : [];

  const historyColumns = historyData.length > 0
    ?[
      {
        title: "No",
        key: "no",
        render: (_: string, __: any, index: number) => <Text>{index + 1}</Text>,
      },
      {
        title: "Kind",
        dataIndex: "kind",
        key: "kind",
        render: (text: string) => <Text>{text}</Text>,
      },
      {
        title: "Service",
        dataIndex: "service",
        key: "service",
        render: (text: string) => <Text>{text}</Text>,
      },
      {
        title: "Outputs",
        dataIndex: "outputs",
        key: "outputs",
        render: (outputs: any[]) => <Text>{outputs?.map((output: any) =>output.stake > 0 ? 
          `👍 ${output.service} ${output.account.username} $${output.stake}` 
          : 
          `👎 ${output.service} ${output.account.username} ${output.msg}.`)
        .join(', ')}</Text>,
      }
    ]
    : [];

  return (
    <MainLayout>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="space-y-6">

            {/* Row 2: Web Version */}
            <Card title="Structured Bet">
              <Space direction="vertical" size="large" className='w-full'>
                {/* Control Panel */}
                <BetControlPanel
                  masterBetAmount={masterBetAmount}
                  pointTolerance={pointTolerance}
                  priceTolerance={priceTolerance}
                  confirmMode={confirmMode}
                  onMasterBetAmountChange={(value) => setMasterBetAmount(value || 0)}
                  onPointToleranceChange={(value) => setPointTolerance(value || 0)}
                  onPriceToleranceChange={(value) => setPriceTolerance(value || 0)}
                  onConfirmModeChange={setConfirmMode}
                />
                <BetForm
                  masterBetAmount={masterBetAmount}
                  pointTolerance={pointTolerance}
                  priceTolerance={priceTolerance}
                  confirmMode={confirmMode}
                />
              </Space>
            </Card>

            {/* Row 3: History */}
            <Space direction="vertical" size="large" className='w-full'>
              <Card
                title="History"
                extra={
                    <Tooltip title="Refresh">
                        <Button type="primary" onClick={fetchHistory} loading={historyLoading} icon={<RedoOutlined />} size='middle' />
                    </Tooltip>
                }
              >
                <Table
                  columns={historyColumns}
                  dataSource={historyData.map((item: any, index: number) => ({
                    ...item,
                    key: item.id ?? index,
                  }))}
                  loading={historyLoading}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: true }}
                  locale={{
                    emptyText: 'No history data',
                  }}
                  size="small"
                />
              </Card>
            </Space>
          </div>
        </div>
      </div>

      {/* Telegram Modal */}
      <Modal
        title="Telegram Bet Selection"
        open={telegramModalVisible}
        onCancel={handleTelegramModalClose}
        footer={[
          <Button key="cancel" onClick={handleTelegramModalClose}>
            Cancel
          </Button>,
          <Button
            key="bet"
            type="primary"
            onClick={handleTelegramBet}
            loading={placingTelegramBet}
          >
            Bet
          </Button>,
        ]}
        width={800}
      >
        {telegramResponseData && (
          <div>
            {/* Input field displayed as string on top */}
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <Text strong>Input: </Text>
              <Text>{telegramResponseData.input}</Text>
            </div>

            {/* Table with checkboxes for msg arrays */}
            <Table
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedMsgRows,
                onChange: (selectedRowKeys) => {
                  setSelectedMsgRows(selectedRowKeys);
                },
              }}
              columns={telegramTableColumns}
              dataSource={telegramResponseData.msg.map((item: any, index: number) => ({
                ...item,
                key: index,
              }))}
              pagination={false}
              scroll={{ y: 400 }}
            />
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default Dashboard;