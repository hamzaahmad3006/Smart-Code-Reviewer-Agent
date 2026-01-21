import React, { useState, useEffect } from 'react';
import { UserCircle, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { getProfile } from '../lib/api';
import ProfileModal from './ProfileModal';
import { useRouter } from 'next/router';
import { User } from '../type';

export default function UserAvatar() {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setUser(data);
        } catch (err: unknown) {
            console.error('Failed to load profile for avatar', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth/signin');
    };

    return (
        <div className="relative">
            {/* Avatar Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-900 overflow-hidden hover:border-primary-500 transition-all focus:outline-hidden flex items-center justify-center shrink-0"
            >
                {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <UserCircle className="w-6 h-6 text-slate-400" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                            <p className="text-sm font-bold text-white truncate">{user?.full_name || user?.username || 'User'}</p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsModalOpen(true);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                            >
                                <UserIcon className="w-4 h-4" />
                                Edit Profile
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                Dashboard
                            </button>
                            <div className="h-px bg-slate-800 my-1 mx-2" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={(updatedUser) => setUser(updatedUser)}
            />
        </div>
    );
}
