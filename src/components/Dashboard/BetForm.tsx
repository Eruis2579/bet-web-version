import React, { useState, useCallback, useEffect } from 'react';
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

const BetForm: React.FC<BetFormProps> = ({ onBetPlaced, siteName, siteSkin, pairIndex = 0 }) => {
    const [searchOptions, setSearchOptions] = useState<BetOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBet, setSelectedBet] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [placing, setPlacing] = useState(false);

    useEffect(() => {
        console.log(selectedBet);
    }, [selectedBet]);
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
            setSearchOptions(res.data.map((bet: BetOption) => ({
                label: <div className="text-sm text-gray-500 flex flex-col gap-1">
                    <span className="font-bold">{bet.title}</span>
                    <span className="text-gray-500">{bet.desc}</span>
                </div>,
                value: bet.title,
            })));
        }).catch(err => {
            window.SM.error(err.response.data.message);
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
        console.log("Asdasdasdasd");

    }, [selectedBet, amount, pairIndex, siteName, onBetPlaced]);

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
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Amount ($)
                        </label>
                        <InputNumber
                            className="w-full"
                            min={0}
                            step={10}
                            value={amount}
                            onChange={(value: number | null) => setAmount(value || 0)}
                            placeholder="Enter amount"
                            size="large"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            type="primary"
                            onClick={handlePlaceBet}
                            loading={placing}
                            disabled={!selectedBet || !amount || amount <= 0}
                            size="large"
                            className="min-w-[120px]"
                        >
                            Place Bet
                        </Button>
                    </div>
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
                <div className="w-48 lg:w-56 xl:w-64 flex-shrink-0">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Amount ($)
                    </label>
                    <InputNumber
                        className="w-full"
                        min={0}
                        step={10}
                        value={amount}
                        onChange={(value: number | null) => setAmount(value || 0)}
                        placeholder="Enter amount"
                    />
                </div>

                {/* Place Bet Button */}
                <div className="pt-7 flex-shrink-0">
                    <Button
                        type="primary"
                        onClick={handlePlaceBet}
                        loading={placing}
                        disabled={!selectedBet || !amount || amount <= 0}
                        className="min-w-[120px]"
                    >
                        Place Bet
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BetForm;
