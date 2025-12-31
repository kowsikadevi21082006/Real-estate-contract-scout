'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-primary-50 pt-20 pb-10 border-t border-primary-200">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                                S
                            </div>
                            <span className="text-lg font-bold text-primary-900">ContractScout</span>
                        </Link>
                        <p className="text-primary-500 text-sm leading-relaxed">
                            Making real estate contracts simple, transparent, and safe for everyone.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-primary-900 mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-primary-500 hover:text-primary-600 text-sm">Features</Link></li>
                            <li><Link href="#" className="text-primary-500 hover:text-primary-600 text-sm">Pricing</Link></li>
                            <li><Link href="#" className="text-primary-500 hover:text-primary-600 text-sm">Case Studies</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-primary-900 mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-primary-500 hover:text-primary-600 text-sm">About</Link></li>
                            <li><Link href="#" className="text-primary-500 hover:text-primary-600 text-sm">Careers</Link></li>
                            <li><Link href="#" className="text-primary-500 hover:text-primary-600 text-sm">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-primary-900 mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-primary-500 hover:text-primary-600 text-sm">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-primary-500 hover:text-primary-600 text-sm">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-primary-400 text-sm">
                        © {new Date().getFullYear()} Contract Scout. All rights reserved.
                    </p>
                    <p className="text-primary-400 text-sm flex items-center gap-1">
                        Created by <span className="font-bold text-primary-600">Alice</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
