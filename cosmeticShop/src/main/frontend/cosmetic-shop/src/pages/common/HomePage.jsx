import React from "react";

const HomePage = () => {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Banner */}
            <div
                className="w-full aspect-[3/1] relative bg-cover bg-center"
                style={{ backgroundImage: "url('/bg.png')" }}
            >
                {/* Shanow */}
                <div className="absolute inset-0 bg-black/40 z-0" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center justify-center h-full text-center gap-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-neutral-200">CosMall</h1>
                    <p className="text-2xl font-medium text-neutral-300">Beautifully selected, specially for you</p>
                </div>
            </div>

            <div className="w-full max-w-7xl flex flex-col gap-8 px-40 py-16">

                {/* Best Seller */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold text-black">Best Seller</h2>
                        <p className="text-lg text-zinc-500">A subheading for this section</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="px-6 py-3 bg-neutral-800 text-white text-base font-medium rounded-lg shadow">
                                Button
                            </button>
                            <button className="px-6 py-3 bg-neutral-200 text-black text-base font-medium rounded-lg shadow">
                                Secondary Button
                            </button>
                        </div>
                    </div>
                    <img src="/product(1).png" alt="Best Seller" className="w-full max-w-md rounded-lg" />
                </div>

                {/* Recommend */}
                <div className="flex flex-col md:flex-row items-center gap-20">
                    <img src="/product(4).png" alt="Recommend" className="w-full max-w-md rounded-lg order-1 md:order-none" />
                    <div className="flex-1 flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold text-black">Recommend</h2>
                        <p className="text-lg text-zinc-500">A subheading for this section</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="px-6 py-3 bg-neutral-800 text-white text-base font-medium rounded-lg shadow">
                                Button
                            </button>
                            <button className="px-6 py-3 bg-neutral-200 text-black text-base font-medium rounded-lg shadow">
                                Secondary Button
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
