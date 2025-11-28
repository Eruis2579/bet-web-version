import React, { useState, useCallback } from 'react';
import { Select, Button, message } from 'antd';
import axios from 'axios';

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
    onBetPlaced: (betData: BetPlacementData) => void;
    onAddToBetslip: (betData: {
        betName: string;
        siteName: string;
        siteSkin: string;
        odds?: string;
        points?: number;
        betData: any;
        suffix?: string;
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
    const [selectedBets, setSelectedBets] = useState<string[]>([]);
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
            setBetData(res.data);
            setSearchOptions(res.data.map((bet: BetOption) => ({
                label: <div className="text-sm text-gray-500 flex flex-col gap-1">
                    <span className="font-bold">{bet.title} {bet.suffix}</span>
                    <span className="text-gray-500">{bet.desc}</span>
                </div>,
                value: bet.title,
            })));
        }).catch(() => {
            window.SM.error("Failed to search bets");
        }).finally(() => {
            setLoading(false);
        });
    }, [siteSkin]);

    const handleSearch = useCallback((value: string) => {
        if (value && value.length > 1) {
            searchBets(value);
        } else {
            setSearchOptions([]);
        }
    }, [searchBets]);

    const handleSelect = useCallback((value: string[]) => {
        setSelectedBets(value);
    }, []);

    const handleClear = useCallback(() => {
        setSelectedBets([]);
        setSearchOptions([]);
    }, []);

    const handlePlaceBet = useCallback(async () => {
        if (!selectedBets || selectedBets.length === 0) {
            message.warning('Please select at least one bet');
            return;
        }

        if (!amount || amount <= 0) {
            message.warning('Please enter a valid amount');
            return;
        }

        setPlacing(true);
        const betSlips = betData.filter(bet => selectedBets.includes(bet.title));
        if (betSlips.length === 0) {
            message.warning('Please select valid bets');
            return;
        }
        
        // Place all selected bets
        const promises = betSlips.map(betSlip => 
            axios.post(`/general/bet`, {
                betSlip: betSlip,
                amount: amount,
                skin: siteSkin
            })
        );

        Promise.all(promises)
            .then(results => {
                console.log(results);
                window.SM.success(`${results.length} bet(s) placed successfully`);
            })
            .catch(() => {
                window.SM.error("Failed to place some bets");
            })
            .finally(() => {
                setPlacing(false);
            });

    }, [selectedBets, amount, pairIndex, siteName, siteSkin, betData]);

    const handleAddToBetslip = useCallback(() => {
        if (!selectedBets || selectedBets.length === 0) {
            message.warning('Please select at least one bet');
            return;
        }

        const betSlips = betData.filter(bet => selectedBets.includes(bet.title));
        if (betSlips.length === 0) {
            message.warning('Please select valid bets');
            return;
        }

        // Add all selected bets to betslip
        betSlips.forEach(betSlip => {
            onAddToBetslip({
                betName: betSlip.title,
                siteName: betSlip.service,
                siteSkin: betSlip.service,
                odds: betSlip.odds,
                points: betSlip.points,
                betData: betSlip,
                suffix: betSlip.suffix
            });
            
        });
        // Reset form after adding to betslip
        setSelectedBets([]);
        setAmount(0);
        setSearchOptions([]);
    }, [selectedBets, betData, siteName, siteSkin, onAddToBetslip]);

    return (
        <div className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="block sm:hidden space-y-4">
                {/* <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{siteName}</h3>
                </div> */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Bet Selection
                        </label>
                    </div>
                    <Select
                        mode="multiple"
                        showSearch
                        placeholder="Search for bets..."
                        className="w-full"
                        options={searchOptions}
                        onSearch={handleSearch}
                        onChange={handleSelect}
                        onClear={handleClear}
                        loading={loading}
                        filterOption={false}
                        notFoundContent={loading ? 'Searching...' : 'Type to search bets'}
                        allowClear
                        value={selectedBets}
                        size="large"
                        maxTagCount="responsive"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleAddToBetslip}
                        disabled={!selectedBets || selectedBets.length === 0}
                        size="large"
                        className="flex-1"
                    >
                        Add to Betslip {selectedBets.length > 0 && `(${selectedBets.length})`}
                    </Button>
                </div>
            </div>

            {/* Desktop Layout (sm and up) */}
            <div className="hidden sm:flex gap-4 items-center">
                {/* Bet Selection */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Bet Selection
                        </label>
                    </div>
                    <Select
                        mode="multiple"
                        showSearch
                        placeholder="Search for bets..."
                        className="w-full"
                        options={searchOptions}
                        onSearch={handleSearch}
                        onChange={handleSelect}
                        onClear={handleClear}
                        loading={loading}
                        filterOption={false}
                        notFoundContent={loading ? 'Searching...' : 'Type to search bets'}
                        allowClear
                        value={selectedBets}
                        maxTagCount="responsive"
                    />
                </div>

                {/* Amount Input */}

                {/* Buttons */}
                <div className="pt-7 flex-shrink-0 flex gap-2">
                    <Button
                        onClick={handleAddToBetslip}
                        disabled={!selectedBets || selectedBets.length === 0}
                        className="min-w-[120px]"
                    >
                        Add to Betslip {selectedBets.length > 0 && `(${selectedBets.length})`}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BetForm;
