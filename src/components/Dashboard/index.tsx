import React, { useState, useCallback, useEffect } from 'react';
import { Card, Space, Typography, List, Tag, Input, Button, Modal, Table, Select, App as AntdApp } from 'antd';
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

interface TelegramResponseData {
  input: string;
  msg: Array<{
    id?: string | number;
    [key: string]: any;
  }>;
}

const BET_SITES = [
  { name: "Action", skin: "Action" },
  { name: "Godds", skin: "Godds" },
  { name: "Highroller", skin: "Highroller" },
  { name: "Fesster", skin: "Fesster" },
  { name: "Betwindycity", skin: "Betwindycity" },
  { name: "Abcwager", skin: "Abcwager" },
  { name: "Strikerich", skin: "Strikerich" },
] as const;

const Dashboard: React.FC = () => {
  const { message } = AntdApp.useApp();
  const [placedBets, setPlacedBets] = useState<BetPlacementData[]>([]);
  const [betslipItems, setBetslipItems] = useState<BetslipItem[]>([]);
  const [placingAllBets, setPlacingAllBets] = useState(false);
  const [selectedSite, setSelectedSite] = useState<typeof BET_SITES[number]>(BET_SITES[0]);
  

  // Telegram version state
  const [telegramInput, setTelegramInput] = useState<string>('');
  const [telegramModalVisible, setTelegramModalVisible] = useState<boolean>(false);
  const [telegramResponseData, setTelegramResponseData] = useState<TelegramResponseData | null>(null);
  const [selectedMsgRows, setSelectedMsgRows] = useState<React.Key[]>([]);
  const [submittingTelegram, setSubmittingTelegram] = useState<boolean>(false);
  const [placingTelegramBet, setPlacingTelegramBet] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

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
        axios.post('/general/bet', {
          betSlip: item.betData,
          amount: item.amount,
          skin: item.siteSkin
        }).then(res => {
          if (res.data[0].stake > 0) {
            window.SM.success(`👍 ${res.data[0].service} ${res.data[0].account.username} $${res.data[0].stake}`);
            fetchHistory();
          } else {
            window.SM.error(`👎 ${res.data[0].service} ${res.data[0].account.username} ${res.data[0].msg}.`);
            fetchHistory();
          }
        }).catch(() => {
          window.SM.error(`Failed to place bet`);
        });
      }
      setBetslipItems([]);
      setPlacingAllBets(false);
    } catch (error) {
      message.error('Failed to place some bets');
    }
  }, [betslipItems]);

  // Telegram version handlers
  const handleTelegramSubmit = useCallback(async () => {
    if (!telegramInput.trim()) {
      message.warning('Please enter input value');
      return;
    }

    setSubmittingTelegram(true);
    try {
      const response = await axios.post('/general/prebet', {
        input: telegramInput
      });

      if (response.data && response.data.input && response.data.betslips && response.data.betslips.length > 0) {
        setTelegramResponseData({
          input: response.data.input,
          msg: response.data.betslips
        });
        setSelectedMsgRows(response.data.betslips.map((_: any, index: number) => index));
        setTelegramModalVisible(true);
      } else {
        window.SM.error('Invalid response format from server');
      }
    } catch (error: any) {
      window.SM.error(error?.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmittingTelegram(false);
    }
  }, [telegramInput]);

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
      setTelegramInput('');
      setTelegramResponseData(null);
      setSelectedMsgRows([]);
    } catch (error: any) {
      window.SM.error(error?.response?.data?.message || 'Failed to place bet');
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
        setHistoryData(response.data);
      } else {
        setHistoryData([]);
      }
    } catch (error: any) {
      window.SM.error(error?.response?.data?.message || 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

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
            {/* Row 1: Telegram Version */}
            <Card title="Telegram Version">
              <Space.Compact className='w-full'>
                <Input.TextArea
                  placeholder="Enter input value"
                  value={telegramInput}
                  onChange={(e) => setTelegramInput(e.target.value)}
                  onPressEnter={handleTelegramSubmit}
                  style={{ flex: 1 }}
                />
              </Space.Compact>
              <Button
                type="primary"
                onClick={handleTelegramSubmit}
                loading={submittingTelegram}
                className='w-full mt-4'
              >
                Submit
              </Button>
            </Card>

            {/* Row 2: Web Version */}
            <Card title="Web Version">
              <Space direction="vertical" size="large" className='w-full'>
                <Select
                  className='w-full'
                  value={selectedSite.name}
                  onChange={(value) => {
                    const idx = BET_SITES.findIndex(site => site.name === value);
                    setSelectedSite(BET_SITES[Math.max(idx, 0)]);

                  }}
                  options={BET_SITES.map(site => ({
                    label: site.name,
                    value: site.name,
                  }))}
                />

                <BetForm
                  pairIndex={BET_SITES.findIndex(site => site.name === selectedSite.name) || 0}
                  onBetPlaced={handleBetPlaced}
                  onAddToBetslip={handleAddToBetslip}
                  siteName={selectedSite.name}
                  siteSkin={selectedSite.skin}
                />

                {placedBets.length > 0 && (
                  <Card type="inner" title="Recent Bets">
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
              </Space>
            </Card>

            {/* Row 3: Web Betslips */}
            <Space direction="vertical" size="large" className='w-full'>
              <Betslip
                items={betslipItems}
                onRemoveItem={handleRemoveFromBetslip}
                onUpdateAmount={handleUpdateBetslipAmount}
                onClearAll={handleClearBetslip}
                onPlaceAllBets={handlePlaceAllBets}
                placing={placingAllBets}
              />

              <Card
                title="History"
                extra={
                  <Button size="small" onClick={fetchHistory} loading={historyLoading}>
                    Refresh
                  </Button>
                }
              >
                <Table
                  columns={historyColumns}
                  dataSource={historyData.map((item, index) => ({
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
              dataSource={telegramResponseData.msg.map((item, index) => ({
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