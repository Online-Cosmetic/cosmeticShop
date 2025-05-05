import React from "react";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";

function SignUp() {

    return (
        <>
            <Header />
            <div class="flex items-center justify-center min-h-screen bg-white">
                <div class="w-full max-w-sm space-y-6">
                    <h1 class="text-3xl font-bold text-gray-900">Create An Account</h1>

                    <div class="space-y-4">

                        <div class="flex gap-4">
                            <input type="text" placeholder="ID" class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                        </div>

                        <input type="password" placeholder="Password" class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                        <input type="username" placeholder="User Name" class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black" />

                        <input type="age" placeholder="Age" class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                        <select id="gender" class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black" required>
                            <option value="MALE">남성</option>
                            <option value="FEMALE">여성</option>
                        </select>
                        <input type="nickname" placeholder="Nick Name" class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black" />

                        <input type="email" placeholder="Email Address" class="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black" />

                    </div>


                    <button class="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition">
                        Button
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default SignUp;
