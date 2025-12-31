import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import UseCases from '@/components/landing/UseCases';

import Footer from '@/components/landing/Footer';

export default function Home() {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <UseCases />
            </main>
            <Footer />
        </div>
    );
}
