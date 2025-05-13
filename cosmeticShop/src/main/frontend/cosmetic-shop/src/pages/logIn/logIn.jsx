import React from "react";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import { Link } from "react-router-dom";

function LogIn() {

    return (
        <>
            <Header />
            <div class="flex items-center justify-center min-h-screen bg-white">
                <div class="w-full max-w-sm space-y-6">
                    <h1 class="text-3xl font-bold text-gray-900">Login</h1>
                    <div class="space-y-4">
                        <input
                            type="userId"
                            placeholder="User ID"
                            class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <div class="text-right">
                            <Link class="text-sm text-gray-500 hover:underline cursor-pointer">
                                Forgot Password?
                            </Link>
                        </div>
                        <div class="text-right">
                            <Link to="" class="text-sm text-gray-500 hover:underline cursor-pointer">
                                Don't Have Account?
                            </Link>
                        </div>
                    </div>
                    <button
                        class="w-full bg-black text-white py-3 rounded text-center font-semibold hover:bg-gray-800 transition">
                        Button
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default LogIn;
