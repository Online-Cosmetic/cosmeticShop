import React, { useEffect, useState } from "react";
import { userAPI } from "../../utils/customAxios";

function AddressForm({ onNewAddress, onAddressSelect }) {
    const [form, setForm] = useState({ city: "", street: "", detail: "" });
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // 컴포넌트 마운트시 저장된 주소 목록 가져오기
    useEffect(() => {
        fetchAddresses();
    }, []);

    // 저장된 주소 목록 가져오기
    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const { data } = await userAPI.addresses.getAll();
            setSavedAddresses(data);

            // 주소 목록을 가져온 후, 첫 번째 주소(기본 배송지)가 있으면 폼에 설정
            if (data && data.length > 0) {
                // 배송지 목록의 첫 번째 항목을 기본 배송지로 간주
                setForm(data[0]);

                // Notify parent component about the initial address
                if (onAddressSelect) {
                    onAddressSelect(data[0]);
                }
            }
        } catch (e) {
            console.error("주소 목록을 불러오는데 실패했습니다.", e);
            setError("주소 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoadingAddresses(false);
        }
    };

    const handleSelect = (address) => {
        setForm(address);
        setShowDropdown(false);

        // Notify parent component about the selected address
        if (onAddressSelect) {
            onAddressSelect(address);
        }
    };

    // 로그인된 사용자가 "Save this Address" 버튼을 눌렀을 때 호출
    const handleSave = async () => {
        setError("");
        // 간단한 유효성 검사
        if (!form.city || !form.street) {
            setError("City와 Street은 필수 입력입니다.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await userAPI.addresses.add(form);

            // 새 주소를 기본 배송지로 설정
            await userAPI.addresses.setDefault(data.id);

            if (onNewAddress) {
                onNewAddress(data);
            }

            // Notify parent component about the new address
            if (onAddressSelect) {
                onAddressSelect(data);
            }

            // 저장 후 주소 목록 다시 불러오기
            await fetchAddresses();

            // 저장 후 폼 초기화
            setForm({ city: "", street: "", detail: "" });
            alert("주소가 저장되었습니다.");
        } catch (e) {
            console.error(e);
            setError("주소 저장 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 border rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Shipping Address</h2>
                {/* 드롭다운 */}
                {savedAddresses && (
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            disabled={loadingAddresses}
                            className="w-40 px-4 py-1.5 border border-neutral-400 rounded-xl text-semibold text-neutral-600"
                        >
                            <span className="flex justify-between w-full">
                                <span>{loadingAddresses ? "Loading..." : "My Address"}</span>
                                <span>▼</span>
                            </span>
                        </button>

                        {showDropdown && (
                            <ul className="absolute right-0 mt-2 w-60 border rounded bg-white shadow z-10">
                                {savedAddresses.length > 0 ? (
                                    savedAddresses.map((addr, index) => (
                                        <li
                                            key={addr.id}
                                            onClick={() => handleSelect(addr)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {index === 0 && (
                                                <span className="inline-block mr-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                                    기본
                                                </span>
                                            )}
                                            {addr.city}, {addr.street}
                                            {addr.detail && `, ${addr.detail}`}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-3 text-gray-400 text-sm text-center">
                                        저장된 주소가 없습니다.
                                    </li>
                                )}
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
                    onChange={(e) => {
                        const updatedForm = { ...form, city: e.target.value };
                        setForm(updatedForm);
                        // Notify parent component about the form change
                        if (onAddressSelect) {
                            onAddressSelect(updatedForm);
                        }
                    }}
                    className="w-full border px-4 py-2 rounded basis-1/2"
                />
                <input
                    type="text"
                    placeholder="Street"
                    value={form.street}
                    onChange={(e) => {
                        const updatedForm = { ...form, street: e.target.value };
                        setForm(updatedForm);
                        // Notify parent component about the form change
                        if (onAddressSelect) {
                            onAddressSelect(updatedForm);
                        }
                    }}
                    className="w-full border px-4 py-2 rounded basis-1/2"
                />
            </div>
            <input
                type="text"
                placeholder="Detail"
                value={form.detail}
                onChange={(e) => {
                    const updatedForm = { ...form, detail: e.target.value };
                    setForm(updatedForm);
                    // Notify parent component about the form change
                    if (onAddressSelect) {
                        onAddressSelect(updatedForm);
                    }
                }}
                className="w-full border px-4 py-2 rounded"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end relative">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className={`py-2 px-4 text-neutral-600 font-semibold border border-neutral-400 rounded-xl
                    ${loading
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-neutral-600 text-white hover:bg-neutral-400"
                    }`}
                >
                    <span className="flex justify-center w-full">
                        {loading ? "Saving..." : "Save this Address"}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default AddressForm;
