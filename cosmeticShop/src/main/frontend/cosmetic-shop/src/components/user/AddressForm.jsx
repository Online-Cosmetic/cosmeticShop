import React, { useState } from "react";

function AddressForm({ savedAddresses = [] }) {
    const [form, setForm] = useState({ city: "", street: "", detail: "" });
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSelect = (address) => {
        setForm(address);
        setShowDropdown(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Shipping Address</h2>
                {/* 드롭다운 */}
                {savedAddresses.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-40 px-4 py-1.5 border border-black rounded-xl text-semibold"
                        >
                          <span className="flex justify-between w-full">
                            <span>My Address</span>
                            <span>▼</span>
                          </span>
                        </button>

                        {showDropdown && (
                            <ul className="absolute right-0 mt-2 w-60 border rounded bg-white shadow z-10">
                                {savedAddresses.map((addr) => (
                                    <li
                                        key={addr.id}
                                        onClick={() => handleSelect(addr)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {addr.city}, {addr.street}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* 입력창 */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border px-4 py-2 rounded basis-1/2"
                />
                <input
                    type="text"
                    placeholder="Street"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full border px-4 py-2 rounded basis-1/2"
                />
            </div>
            <input
                type="text"
                placeholder="Detail"
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
                className="w-full border px-4 py-2 rounded"
            />
            <div className="flex justify-end relative">
                <button
                    className="w-full py-2 bg-neutral-600 text-white font-semibold rounded-lg"
                >
                      <span className="flex justify-center w-full">Save this Address</span>
                </button>
            </div>
        </div>
    );
}

export default AddressForm;