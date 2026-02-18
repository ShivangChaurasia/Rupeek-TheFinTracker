
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 animate-in fade-in duration-500">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
