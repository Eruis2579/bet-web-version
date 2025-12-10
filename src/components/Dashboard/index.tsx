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
        title: <span className="text-slate-200">Msg</span>,
        dataIndex: "msg",
        key: "msg",
        render: (text: string) => <Text className="text-slate-300">{text}</Text>,
      }
    ]
    : [];

  const historyColumns = historyData.length > 0
    ?[
      {
        title: <span className="text-slate-200">No</span>,
        key: "no",
        render: (_: string, __: any, index: number) => <Text className="text-slate-300">{index + 1}</Text>,
      },
      {
        title: <span className="text-slate-200">Kind</span>,
        dataIndex: "kind",
        key: "kind",
        render: (text: string) => <Text className="text-slate-300">{text}</Text>,
      },
      {
        title: <span className="text-slate-200">Service</span>,
        dataIndex: "service",
        key: "service",
        render: (text: string) => <Text className="text-slate-300">{text}</Text>,
      },
      {
        title: <span className="text-slate-200">Outputs</span>,
        dataIndex: "outputs",
        key: "outputs",
        render: (outputs: any[]) => <Text className="text-slate-300">{outputs?.map((output: any) =>output.stake > 0 ? 
          `👍 ${output.service} ${output.account.username} $${output.stake}` 
          : 
          `👎 ${output.service} ${output.account.username} ${output.msg}.`)
        .join(', ')}</Text>,
      }
    ]
    : [];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">

            {/* Row 2: Web Version */}
            <Card 
              title={<span className="text-slate-100 font-semibold">Structured Bet</span>}
              className="!bg-slate-800/50 !border-slate-700/50 backdrop-blur-sm shadow-xl"
              headStyle={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', background: 'transparent' }}
              bodyStyle={{ background: 'transparent' }}
            >
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
                title={<span className="text-slate-100 font-semibold">History</span>}
                extra={
                    <Tooltip title="Refresh">
                        <Button 
                          type="primary" 
                          onClick={fetchHistory} 
                          loading={historyLoading} 
                          icon={<RedoOutlined />} 
                          size='middle'
                          className="!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500"
                        />
                    </Tooltip>
                }
                className="!bg-slate-800/50 !border-slate-700/50 backdrop-blur-sm shadow-xl"
                headStyle={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', background: 'transparent' }}
                bodyStyle={{ background: 'transparent' }}
              >
                <Table
                  columns={historyColumns}
                  dataSource={historyData.map((item: any, index: number) => ({
                    ...item,
                    key: item.id ?? index,
                  }))}
                  loading={historyLoading}
                  pagination={{ 
                    pageSize: 10,
                    className: 'dark-pagination'
                  }}
                  scroll={{ x: true }}
                  locale={{
                    emptyText: <span className="text-slate-400">No history data</span>,
                  }}
                  size="small"
                  className="dark-table"
                />
              </Card>
            </Space>
          </div>
        </div>
      </div>

      {/* Telegram Modal */}
      <Modal
        title={<span className="text-slate-100 font-semibold">Telegram Bet Selection</span>}
        open={telegramModalVisible}
        onCancel={handleTelegramModalClose}
        footer={[
          <Button 
            key="cancel" 
            onClick={handleTelegramModalClose}
            className="!border-slate-600 !text-slate-300 hover:!border-slate-400 hover:!text-slate-100 !bg-slate-700/50"
          >
            Cancel
          </Button>,
          <Button
            key="bet"
            type="primary"
            onClick={handleTelegramBet}
            loading={placingTelegramBet}
            className="!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500"
          >
            Bet
          </Button>,
        ]}
        width={800}
        className="dark-modal"
        styles={{
          content: { backgroundColor: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.2)' },
          header: { backgroundColor: '#1e293b', borderBottom: '1px solid rgba(148, 163, 184, 0.2)' },
          footer: { backgroundColor: '#1e293b', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }
        }}
      >
        {telegramResponseData && (
          <div>
            {/* Input field displayed as string on top */}
            <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <Text strong className="text-slate-200">Input: </Text>
              <Text className="text-slate-300">{telegramResponseData.input}</Text>
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
              className="dark-table"
            />
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default Dashboard;