"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-black text-white pt-12 pb-0 lg:py-12 border-t border-neutral-900">
            <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10">
                                <img
                                    src="/Rabuste logo.png"
                                    alt="Rabuste Coffee"
                                    className="object-contain w-full h-full brightness-0 invert"
                                />
                            </div>
                            <span className="font-display text-2xl font-bold text-white tracking-wide">
                                Rabuste
                            </span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                            Crafting premium coffee experiences for connoisseurs worldwide. Join us in celebrating the fine art of brewing.
                        </p>

                        {/* Newsletter */}
                        <div className="pt-4">
                            <h4 className="font-bold text-sm mb-3 text-[#dcbba0] uppercase tracking-wider">Stay Updated</h4>
                            <form className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded text-sm focus:outline-none focus:border-[#dcbba0] transition-colors"
                                    suppressHydrationWarning
                                />
                                <button className="bg-[#dcbba0] text-black font-semibold px-4 py-2 rounded text-sm hover:bg-[#c5a289] transition-colors" suppressHydrationWarning>
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-[#dcbba0]">Explore</h4>
                        <ul className="space-y-2 text-neutral-400">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors duration-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors duration-200">
                                    Our Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors duration-200">
                                    Art Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors duration-200">
                                    Workshops
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal/Company */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-[#dcbba0]">Company</h4>
                        <ul className="space-y-2 text-neutral-400">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors duration-200">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors duration-200">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Socials & Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-[#dcbba0]">Connect</h4>
                        <div className="flex space-x-4 mb-6">
                            <Link href="https://www.instagram.com/rabuste.coffee/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors duration-200">
                                <Instagram className="w-5 h-5 text-white" />
                            </Link>
                            <Link href="#" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors duration-200">
                                <Twitter className="w-5 h-5 text-white" />
                            </Link>
                            <Link href="#" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors duration-200">
                                <Linkedin className="w-5 h-5 text-white" />
                            </Link>
                            <Link href="#" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors duration-200">
                                <Facebook className="w-5 h-5 text-white" />
                            </Link>
                        </div>
                        <p className="text-neutral-400 text-sm">
                            hello@rabuste.coffee <br />
                            +91 89678-89090
                        </p>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm">
                    <p>© {currentYear} Rabuste Coffee. All rights reserved.</p>
                    <p className="mt-2 md:mt-0 font-serif italic">Brewed with passion.</p>
                </div>
            </div>
        </footer>
    );
}
