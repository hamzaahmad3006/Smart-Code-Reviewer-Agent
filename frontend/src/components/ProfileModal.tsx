import React, { useState, useEffect } from 'react';
import { X, Camera, Loader2, Save, User as UserIcon, UserCircle } from 'lucide-react';
import { getProfile, updateProfile, uploadToCloudinary } from '../lib/api';
import { User, ProfileModalProps } from '../type';



export default function ProfileModal({ isOpen, onClose, onUpdate }: ProfileModalProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen]);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const data = await getProfile();
            setUser(data);
            setFullName(data.full_name || '');
            setUsername(data.username || '');
            setAvatarUrl(data.avatar_url || '');
        } catch (err: unknown) {
            setError('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');
        try {
            const url = await uploadToCloudinary(file);
            setAvatarUrl(url);
        } catch (err: unknown) {
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            const updated = await updateProfile({
                full_name: fullName,
                username: username,
                avatar_url: avatarUrl
            });
            onUpdate(updated);
            onClose();
        } catch (err: unknown) {
            setError('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <UserIcon className="text-primary-400" />
                        User Profile
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                            <p className="text-slate-400">Loading your profile...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 flex items-center justify-center">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle className="w-full h-full text-slate-600" />
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-primary-500 hover:bg-primary-600 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 italic text-center">Cloudinary supported</p>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-primary-500 outline-hidden transition-colors"
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="space-y-1.5 opacity-60">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email (Read Only)</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={isSaving || uploading}
                                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isSaving ? 'Updating...' : 'Save Changes'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
