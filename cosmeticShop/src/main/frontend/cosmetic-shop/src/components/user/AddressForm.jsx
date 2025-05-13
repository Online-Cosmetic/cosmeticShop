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
            <h2 className="text-2xl font-semibold">Shipping Address</h2>

            {/* 저장된 배송지 */}
            {savedAddresses.length > 0 && (
                <>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full text-left px-4 py-2 bg-gray-100 border rounded"
                    >
                        Saved Addresses ▼
                    </button>

                    {showDropdown && (
                        <ul className="border rounded w-full bg-white shadow mt-2">
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
                </>
            )}
            {/* 입력창 */}
            <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border px-4 py-2 rounded"
            />
            <input
                type="text"
                placeholder="Street"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="w-full border px-4 py-2 rounded"
            />
            <input
                type="text"
                placeholder="Detail"
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
                className="w-full border px-4 py-2 rounded"
            />
        </div>
    );
}

export default AddressForm;