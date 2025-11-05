import React, { useState, useCallback } from 'react';
import { Select, InputNumber, Button, message } from 'antd';
import axios from 'axios';

interface BetOption {
    desc: string;
    idgm: number;
    idmk: number;
    odds: string;
    points: number;
    sport: string;
    title: string;
}

interface BetFormProps {
    onBetPlaced: (betData: BetPlacementData) => void;
    onAddToBetslip: (betData: {
        betName: string;
        siteName: string;
        siteSkin: string;
        odds?: string;
        points?: number;
        betData: any;
    }) => void;
    siteName: string;
    siteSkin: string;
    pairIndex?: number;
}

interface BetPlacementData {
    betId: string;
    betName: string;
    amount: number;
    pairIndex: number;
    siteName: string;
    siteSkin: string;
}

const BetForm: React.FC<BetFormProps> = ({ onBetPlaced, onAddToBetslip, siteName, siteSkin, pairIndex = 0 }) => {
    const [searchOptions, setSearchOptions] = useState<BetOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [betData, setBetData] = useState<BetOption[]>([]);
    const [selectedBet, setSelectedBet] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [placing, setPlacing] = useState(false);

    const searchBets = useCallback(async (searchQuery: string) => {
        if (!searchQuery || searchQuery.length === 0) {
            setSearchOptions([]);
            return;
        }

        setLoading(true);
        axios.get(`/general/teams`, {
            params: {
                skin: siteSkin,
                search: searchQuery
            }
        }).then(res => {
            console.log(res.data);
            setBetData(res.data);
            setSearchOptions(res.data.map((bet: BetOption) => ({
                label: <div className="text-sm text-gray-500 flex flex-col gap-1">
                    <span className="font-bold">{bet.title}</span>
                    <span className="text-gray-500">{bet.desc}</span>
                </div>,
                value: bet.title,
            })));
        }).catch(() => {
            window.SM.error("Failed to search bets");
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleSearch = useCallback((value: string) => {
        if (value && value.length > 1) {
            searchBets(value);
        } else {
            setSearchOptions([]);
        }
    }, [searchBets]);

    const handleSelect = useCallback((value: string) => {
        setSelectedBet(value);
    }, []);

    const handleClear = useCallback(() => {
        setSelectedBet(null);
        setSearchOptions([]);
    }, []);

    const handlePlaceBet = useCallback(async () => {
        if (!selectedBet) {
            message.warning('Please select a bet');
            return;
        }

        if (!amount || amount <= 0) {
            message.warning('Please enter a valid amount');
            return;
        }

        setPlacing(true);
        const betSlip = betData.find(bet => bet.title === selectedBet);
        if (!betSlip) {
            message.warning('Please select a valid bet');
            return;
        }
        console.log(betSlip,amount);
        
        axios.post(`/general/bet`, {
            betSlip: betSlip,
            amount: amount,
            skin: siteSkin
        }).then(res => {
            console.log(res.data);
            window.SM.success('Bet placed successfully');
        }).catch(() => {
            window.SM.error("Failed to place bet");
        }).finally(() => {
            setPlacing(false);
        });

    }, [selectedBet, amount, pairIndex, siteName, onBetPlaced]);

    const handleAddToBetslip = useCallback(() => {
        if (!selectedBet) {
            message.warning('Please select a bet');
            return;
        }

        const betSlip = betData.find(bet => bet.title === selectedBet);
        if (!betSlip) {
            message.warning('Please select a valid bet');
            return;
        }

        onAddToBetslip({
            betName: betSlip.title,
            siteName: siteName,
            siteSkin: siteSkin,
            odds: betSlip.odds,
            points: betSlip.points,
            betData: betSlip
        });

        // Reset form after adding to betslip
        setSelectedBet(null);
        setAmount(0);
        setSearchOptions([]);
    }, [selectedBet, betData, siteName, siteSkin, onAddToBetslip]);

    return (
        <div className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="block sm:hidden space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{siteName}</h3>
                </div>
                <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Bet Selection
                        </label>
                    </div>
                    <Select
                        showSearch
                        placeholder="Search for a bet..."
                        className="w-full"
                        options={searchOptions}
                        onSearch={handleSearch}
                        onSelect={handleSelect}
                        onClear={handleClear}
                        loading={loading}
                        filterOption={false}
                        notFoundContent={loading ? 'Searching...' : 'Type to search bets'}
                        allowClear
                        value={selectedBet}
                        size="large"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleAddToBetslip}
                        disabled={!selectedBet}
                        size="large"
                        className="flex-1"
                    >
                        Add to Betslip
                    </Button>
                </div>
            </div>

            {/* Desktop Layout (sm and up) */}
            <div className="hidden sm:flex gap-4 items-center">
                {/* Bet Selection */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {siteName}
                        </label>
                    </div>
                    <Select
                        showSearch
                        placeholder="Search for a bet..."
                        className="w-full"
                        options={searchOptions}
                        onSearch={handleSearch}
                        onSelect={handleSelect}
                        onClear={handleClear}
                        loading={loading}
                        filterOption={false}
                        notFoundContent={loading ? 'Searching...' : 'Type to search bets'}
                        allowClear
                        value={selectedBet}
                    />
                </div>

                {/* Amount Input */}

                {/* Buttons */}
                <div className="pt-7 flex-shrink-0 flex gap-2">
                    <Button
                        onClick={handleAddToBetslip}
                        disabled={!selectedBet}
                        className="min-w-[120px]"
                    >
                        Add to Betslip
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BetForm;
