import React from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PieChart, Shield } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogoText from '../components/LogoText';

// Import Lottie JSONs
import financeAnim from '../Lottie/Finance.json';
import revenueAnim from '../Lottie/Revenue.json';
import analysisAnim from '../Lottie/analysis.json';

export default function Landing() {
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 md:py-32 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                <div className="flex-1 space-y-8 animate-in slide-in-from-left-8 duration-700">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                        Financial Freedom, <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Simplified.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 leading-relaxed font-light">
                        Experience the future of personal finance with <LogoText />. Smart tracking, custom salary cycles, and premium analytics designed for the modern earner.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                        <Link to={currentUser ? "/dashboard" : "/signup"}>
                            <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-full">
                                Start Your Journey <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground pt-4 justify-center md:justify-start">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" /> Free Forever
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" /> Bank-Grade Security
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full max-w-md md:max-w-2xl animate-in fade-in zoom-in duration-1000 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
                    <Lottie animationData={financeAnim} loop={true} />
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-muted/40 py-24 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="container mx-auto px-4">
                    <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-2">
                            Why Choose <LogoText />?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            We've reimagined expense tracking to fit your lifestyle, not the other way around.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div className="order-2 md:order-1 bg-card p-8 rounded-3xl shadow-2xl border border-border/50">
                            <Lottie animationData={analysisAnim} loop={true} className="max-w-md mx-auto" />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                                    <PieChart className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold">Crystal Clear Analytics</h3>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Visualise your income and expenses with stunning, interactive charts. Our analytics engine gives you deep insights into your spending habits, helping you curb unnecessary expenses.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                                    Monthly spending breakdown by category
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                                    Trend analysis over time
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                                    Income vs Expense ratios
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold">Salary Cycles That Work</h3>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Most apps assume your month starts on the 1st. We don't. <LogoText /> lets you configure your own salary cycle (e.g., 25th to 24th), ensuring your budget aligns perfectly with your paycheck.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                                    Customizable start dates
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                                    Accurate "Current Balance" calculations
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                                    Automatic salary prompting
                                </li>
                            </ul>
                        </div>
                        <div className="bg-card p-8 rounded-3xl shadow-2xl border border-border/50">
                            <Lottie animationData={revenueAnim} loop={true} className="max-w-md mx-auto" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
