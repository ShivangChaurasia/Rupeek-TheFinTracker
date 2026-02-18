import React from 'react';
import { Wallet, Linkedin, Github } from 'lucide-react';
import rupeekLogo from '../assets/rupeek.png';
import LogoText from './LogoText';

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-12 mt-auto">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <img src={rupeekLogo} alt="Rupeek Logo" className="w-5 h-5 object-contain filter brightness-0 invert" />
                        </div>
                        <LogoText className="text-lg" />
                    </div>
                    <p className="text-muted-foreground max-w-xs">
                        Simple, secure, and smart financial tracking for everyone. Master your money, shape your future.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href="https://www.linkedin.com/in/shivang-chaurasia-754232297/" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-blue-600 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="https://github.com/ShivangChaurasia" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted rounded-full hover:bg-primary/20 hover:text-black dark:hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="#" className="hover:text-primary">Features</a></li>
                        <li><a href="#" className="hover:text-primary">Pricing</a></li>
                        <li><a href="#" className="hover:text-primary">Security</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="#" className="hover:text-primary">About Us</a></li>
                        <li><a href="#" className="hover:text-primary">Contact</a></li>
                        <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
                © {new Date().getFullYear()} <LogoText />. All rights reserved.
            </div>
        </footer>
    );
}
