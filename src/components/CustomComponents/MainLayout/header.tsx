import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import { DollarOutlined, SettingOutlined } from '@ant-design/icons';

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-b from-slate-900 to-slate-800 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div
                        onClick={() => navigate('/landing')}
                        className="group cursor-pointer flex items-center gap-3 transition-all duration-300 hover:gap-4"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Zap className="relative w-7 h-7 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="hidden md:block text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-emerald-400 transition-all duration-300">
                                Sports Betting
                            </h1>
                            <p className="hidden lg:block text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300 font-medium">
                                Auto Bet Platform
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Tooltip title="Bet Control" placement="bottom">
                            <Button
                                onClick={() => navigate('/dashboard')}
                                icon={<DollarOutlined className="text-lg" />}
                                size="large"
                                className="!border-slate-600 !text-slate-300 hover:!border-emerald-400 hover:!text-emerald-400 !bg-slate-800/50 hover:!bg-slate-700/50 transition-all duration-300 font-semibold"
                                variant="outlined"
                            />
                        </Tooltip>
                        <Tooltip title="Settings" placement="bottom">
                            <Button
                                onClick={() => navigate('/manage')}
                                icon={<SettingOutlined className="text-lg" />}
                                size="large"
                                className="!border-slate-600 !text-slate-300 hover:!border-emerald-400 hover:!text-emerald-400 !bg-slate-800/50 hover:!bg-slate-700/50 transition-all duration-300 font-semibold"
                                variant="outlined"
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </header>
    );
}