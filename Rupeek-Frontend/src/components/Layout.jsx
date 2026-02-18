import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    History,
    PieChart,
    User,
    LogOut,
    Sun,
    Moon,
    Wallet
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function Layout() {
    const { logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: History, label: 'History', path: '/history' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <Wallet className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">FinTracker</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-4 border-t border-border space-y-2">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <Wallet className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold">FinTracker</span>
                    </div>
                    {/* Mobile menu could go here, for now simpler */}
                </header>

                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden flex items-center justify-around border-t border-border bg-card p-2 safe-bottom">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-xs">{item.label}</span>
                        </NavLink>
                    ))}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground"
                    >
                        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        <span className="text-xs">Theme</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
