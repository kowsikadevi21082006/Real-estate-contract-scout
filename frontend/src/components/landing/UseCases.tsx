'use client';

const cases = [
    {
        title: "For Renters",
        description: "Don't let legal jargon trap you in a bad lease. Upload your contract to spot hidden fees and restrictive clauses instantly.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        stat: "10x Faster Analysis"
    },
    {
        title: "For Landlords",
        description: "Ensure your contracts are fair and compliant. Use our meaningful comparisons to stay competitive in the market.",
        image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        stat: "100% Compliant"
    },
    {
        title: "For Agents",
        description: "Review dozens of leases in minutes. Give your clients the confidence they need to sign on the dotted line.",
        image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        stat: "Save 5+ Hrs/Week"
    }
];

export default function UseCases() {
    return (
        <section id="use-cases" className="py-24 bg-primary-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-black text-primary-900 mb-6">
                            Built for everyone involved.
                        </h2>
                        <p className="text-primary-500 text-lg">
                            Whether you're signing, sending, or reviewing, Contract Scout makes the process seamless.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cases.map((useCase, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                            {/* Image Background Effect */}
                            <div className="absolute inset-0 bg-primary-900 z-10 opacity-0 group-hover:opacity-10 transition-opacity" />

                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={useCase.image}
                                    alt={useCase.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-primary-900 shadow-lg">
                                    {useCase.stat}
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-primary-900 mb-4">{useCase.title}</h3>
                                <p className="text-primary-500 leading-relaxed">
                                    {useCase.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
