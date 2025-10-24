import { Zap} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function () {
    const [time, setTime] = useState(new Date());
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <>
            <header className="bg-white/10 backdrop-blur-lg border-b border-black/20 sticky top-0 z-50">
                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div onClick={() => navigate('/dashboard')} className="cursor-pointer flex items-center space-x-2 text-white">
                                <Zap className="w-6 h-6 text-green-500" />
                                <h1 className="hidden md:block text-2xl font-bold text-green-500">Sports Betting - Auto Bet</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1 sm:space-x-4">
                            <span className="text-black">{time.toUTCString()}</span>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}