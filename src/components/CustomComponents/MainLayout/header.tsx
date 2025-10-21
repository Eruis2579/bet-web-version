import { LogOut, User, History, Zap, Wallet, Home, ShieldPlus} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function () {
    const { user, logout } = useAuth();
    
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            window.SM.error("Server Error");
        }
    };
    return (
        <>
            <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div onClick={() => navigate('/dashboard')} className="cursor-pointer flex items-center space-x-2 text-white">
                                <Zap className="w-6 h-6 text-green-500" />
                                <h1 className="hidden md:block text-2xl font-bold text-white">SportsBet Pro</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1 sm:space-x-4">
                            <div className="flex items-center space-x-2 text-white ">
                                <Wallet className="w-5 h-5 text-[#24A556] w-10 h-10 bg-white/10  rounded-lg" />
                                <span>
                                    $ {user?.balance.toLocaleString('en-US')}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-white">
                                <User className="w-5 h-5" />
                                <span className="hidden md:block">
                                    {user?.firstName} {user?.lastName}
                                </span>
                            </div>

                            {/* Header Icons */}
                            {
                                !!user?.isAdmin && (
                                    <button
                                        className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                                        title="Site Management"
                                        onClick={() => window.open('/portal', '_self')}
                                    >
                                        <ShieldPlus className="w-5 h-5 text-white" />
                                    </button>
                                )
                            }
                            <button
                                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                                title="Account Settings"
                                onClick={() => navigate('/bet')}
                            >
                                <Home className="w-5 h-5 text-white" />
                            </button>
                            <button
                                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                                title="Betting History"
                                onClick={() => navigate('/history')}
                            >
                                <History className="w-5 h-5 text-white" />
                            </button>


                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                            >
                                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}