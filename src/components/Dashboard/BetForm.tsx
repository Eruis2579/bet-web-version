import React, { useState, useCallback } from 'react';
import { Input, message, Card, Typography, Tag, Row, Col, Spin, Modal, Button, List, Space, Divider } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;

const serviceColors = {
    "abcwager": "blue",
    "action": "green",
    "betwindycity": "red",
    "fesster": "purple",
    "godds": "orange",
    "strikerich": "brown",
}
interface BetOption {
    desc: string;
    idgm: number;
    idmk: number;
    odds: string;
    points: number;
    sport: string;
    title: string;
    service: string;
    suffix: string;
}

interface BetFormProps {
    masterBetAmount: number;
    pointTolerance: number;
    priceTolerance: number;
    confirmMode: boolean;
}

const BetForm: React.FC<BetFormProps> = ({
    masterBetAmount,
    pointTolerance,
    priceTolerance,
    confirmMode
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [betData, setBetData] = useState<BetOption[]>([]);
    const [placing, setPlacing] = useState<string | null>(null);
    const [confirmList, setConfirmList] = useState<any[]>([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
    const [selectedBet, setSelectedBet] = useState<BetOption | null>(null);

    const searchBets = useCallback(async (query: string) => {
        if (!query || query.length === 0) {
            setBetData([]);
            return;
        }

        if (query.length < 2) {
            setBetData([]);
            return;
        }

        setLoading(true);
        axios.get(`/general/teams`, {
            params: {
                search: query
            }
        }).then(res => {
            setBetData(res.data || []);
        }).catch(() => {
            window.SM.error("Failed to search bets");
            setBetData([]);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        searchBets(value);
    }, [searchBets]);

    const handleClear = useCallback(() => {
        setSearchQuery('');
        setBetData([]);
    }, []);

    const handlePlaceBet = useCallback(async (bet: BetOption) => {
        if (confirmModalVisible) {
            if (confirmList.length === 0) {
                message.warning('No bets to confirm');
                return;
            }
        }
        if (!masterBetAmount || masterBetAmount <= 0) {
            message.warning('Please set a valid Master Bet Amount');
            return;
        }

        const betKey = bet.service + "=====" + bet.title;
        setPlacing(betKey);
        setSelectedBet(bet);

        try {
            const response = await axios.post(`/general/bet`, {
                betSlip: bet,
                amount: masterBetAmount,
                skin: bet.service.toLowerCase(),
                pointTolerance: pointTolerance,
                oddsTolerance: priceTolerance,
                confirmMode: confirmModalVisible ? false : confirmMode,
                filterEventsList: confirmList || []
            });

            if (confirmMode && !confirmModalVisible) {
                setConfirmList(response.data || []);
                setConfirmModalVisible(true);
            } else {
                window.SM.success('Bet placed successfully.');
            }
        } catch (error: any) {
            window.SM.error(error?.response?.data?.message || "Failed to place bet");
        } finally {
            setPlacing(null);
            if (confirmModalVisible) {
                setConfirmModalVisible(false);
                setConfirmList([]);
                setSelectedBet(null);
            }
        }
    }, [masterBetAmount, pointTolerance, priceTolerance, confirmMode, confirmList]);

    const handleRemoveFromConfirmList = useCallback((index: number) => {
        setConfirmList(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleCancelConfirm = useCallback(() => {
        setConfirmModalVisible(false);
        setConfirmList([]);
        setSelectedBet(null);
    }, []);

    const getBetKey = (bet: BetOption) => bet.service + "=====" + bet.title;

    return (
        <div className="w-full p-3 sm:p-4 border border-slate-700/50 rounded-xl bg-slate-700/30 backdrop-blur-sm shadow-lg">
            <div className="space-y-4">
                {/* Search Input */}
                <div className="w-full">
                    <Input
                        placeholder="Search for bets..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        size="large"
                        allowClear
                        onClear={handleClear}
                        className="dark-input"
                        style={{ 
                            backgroundColor: '#334155',
                            borderColor: '#475569',
                            color: '#e2e8f0'
                        }}
                    />
                </div>

                {/* Heading */}
                {betData.length > 0 && (
                    <Title level={5} className="!mb-4 !text-slate-200">
                        Select a bet to Auto-Match:
                    </Title>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                )}

                {/* Bet Cards Grid */}
                {!loading && betData.length > 0 && (
                    <Row gutter={[16, 16]}>
                        {betData.map((bet, index) => {
                            const betKey = getBetKey(bet);
                            const isPlacing = placing === betKey;

                            return (
                                <Col xs={24} sm={12} md={8} lg={8} key={`${betKey}-${index}`}>
                                    <Card
                                        hoverable
                                        className={`h-full cursor-pointer transition-all dark-bet-card ${isPlacing ? 'opacity-50 pointer-events-none' : ''
                                            }`}
                                        onClick={() => !placing && !isPlacing && handlePlaceBet(bet)}
                                        loading={isPlacing}
                                        style={{
                                            backgroundColor: '#1e293b',
                                            borderColor: '#475569',
                                        }}
                                        styles={{
                                            body: { color: '#e2e8f0' }
                                        }}
                                    >
                                        <div className="flex flex-col gap-2">
                                            {/* Bet Title */}
                                            <div className="flex justify-between items-center">
                                                <div className='flex flex-col gap-2'>
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-1">
                                                            <Text strong className="text-sm block mb-1 text-slate-200">
                                                                {bet.title} {bet.suffix}
                                                            </Text>
                                                        </div>
                                                    </div>

                                                    {/* Provider/Category */}
                                                    <Text className="text-xs block text-slate-400">
                                                        {bet.desc}
                                                    </Text>
                                                </div>
                                                <Tag color={serviceColors[bet.service.toLowerCase() as keyof typeof serviceColors] || 'blue'} className="m-0">
                                                    {bet.service.charAt(0).toUpperCase() + bet.service.slice(1)}
                                                </Tag>
                                            </div>

                                            {/* Provider Label and Odds */}
                                            <Divider size="small" style={{ borderColor: '#475569' }} />
                                            <div className="flex items-center justify-between mt-2">
                                                <Text strong className={bet.odds ? (parseFloat(bet.odds) > 0 ? 'text-emerald-400' : 'text-red-400') : 'text-slate-300'}>Line:</Text>
                                                {bet.odds && (
                                                    <Text strong className={parseFloat(bet.odds) > 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                        {bet.odds}
                                                    </Text>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}

                {/* Empty State */}
                {!loading && searchQuery && searchQuery.length >= 2 && betData.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        <Text className="text-slate-400">No bets found. Try a different search term.</Text>
                    </div>
                )}

                {/* Initial State */}
                {!loading && !searchQuery && betData.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        <Text className="text-slate-400">Type to search for bets...</Text>
                    </div>
                )}
            </div>

            {/* Confirm Master Bet Modal */}
            <Modal
                title={<Title level={4} className="!mb-0 !text-slate-100">Confirm Master Bet</Title>}
                open={confirmModalVisible}
                onCancel={handleCancelConfirm}
                footer={null}
                width={700}
                closable={true}
                className="dark-modal"
                styles={{
                    content: { backgroundColor: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.2)' },
                    header: { backgroundColor: '#1e293b', borderBottom: '1px solid rgba(148, 163, 184, 0.2)' },
                    footer: { backgroundColor: '#1e293b', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }
                }}
            >
                {selectedBet && (
                    <div className="space-y-1">
                        {/* Master Bet Details */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Text strong className="text-slate-200">Master Bet Amount:</Text>
                                <Text strong className="text-lg text-emerald-400">${masterBetAmount}</Text>
                            </div>
                            <div className="flex justify-between items-center">
                                <Text strong className="text-slate-200">Target:</Text>
                                <Text className="text-slate-300">{selectedBet.title} {selectedBet.suffix} ({selectedBet.points}/{selectedBet.odds})</Text>
                            </div>
                        </div>

                        {/* Execution Plan */}
                        <div className="mt-4 overflow-y-auto max-h-[400px]">
                            <Text strong className="text-base block mb-2 text-slate-200">Execution Plan (Best Odds First):</Text>
                            <List
                                dataSource={confirmList}
                                renderItem={(item: any, index: number) => (
                                    <List.Item
                                        className="border-b border-slate-700 py-3"
                                        style={{ borderColor: '#475569' }}
                                        actions={[
                                            <CloseCircleOutlined
                                                key="remove"
                                                className="text-yellow-400 cursor-pointer text-lg hover:text-yellow-300 transition-colors"
                                                onClick={() => handleRemoveFromConfirmList(index)}
                                            />
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <Space>
                                                    <Text strong className="text-slate-200">#{index + 1} {item.serviceName ? item.serviceName.charAt(0).toUpperCase() + item.serviceName.slice(1) : 'Unknown'}:</Text>
                                                </Space>
                                            }
                                            description={
                                                <div className="flex justify-between items-center">
                                                    <div className="space-y-1">
                                                        <Text className="block text-slate-400">{item.desc}</Text>
                                                        <Text className="text-sm text-slate-300">
                                                            {item.title}
                                                        </Text>
                                                    </div>
                                                    <div>
                                                        <Text className="text-sm text-emerald-400">{item.suffix}</Text>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>

                        {/* Execution Logic Explanation */}
                        <div className="mt-3">
                            <Text className="text-xs text-slate-400">
                                * System will bet max on site #1, then #2, etc., until ${masterBetAmount} is reached.
                            </Text>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
                            <Button 
                                onClick={handleCancelConfirm} 
                                size="large"
                                className="!border-slate-600 !text-slate-300 hover:!border-slate-400 hover:!text-slate-100 !bg-slate-700/50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => handlePlaceBet(selectedBet)}
                                loading={placing === getBetKey(selectedBet)}
                                size="large"
                                className="!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500"
                            >
                                CONFIRM & BET
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BetForm;
