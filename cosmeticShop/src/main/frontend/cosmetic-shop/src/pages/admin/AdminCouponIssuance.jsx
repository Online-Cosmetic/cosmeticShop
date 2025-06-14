// src/pages/admin/AdminCouponIssuance.jsx

import React, { useState, useEffect } from "react";
import { adminAPI } from "../../utils/customAxios";

export default function AdminCouponIssuance() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [discountRate, setDiscountRate] = useState("");
    const [duration, setDuration] = useState("");
    const [couponName, setCouponName] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch all companies for dropdown
    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const response = await adminAPI.coupon.getAllCompanyNames();
                // CompanyNamesDTO에서 companyNames 리스트를 추출하여 설정
                setCompanies(response.data.companyNames || []);
            } catch (error) {
                console.error("Error fetching companies:", error);
                setError("Failed to load companies. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    // Validate form inputs
    const validateForm = () => {
        if (!selectedCompany) {
            setError("Please select a brand name.");
            return false;
        }

        const discountRateNum = parseInt(discountRate);
        if (isNaN(discountRateNum) || discountRateNum < 1 || discountRateNum > 99) {
            setError("Discount rate must be a number between 1 and 99.");
            return false;
        }

        const durationNum = parseInt(duration);
        if (isNaN(durationNum) || durationNum < 1) {
            setError("Duration must be a positive number.");
            return false;
        }

        if (!couponName.trim()) {
            setError("Please enter a coupon name.");
            return false;
        }

        return true;
    };

    // handleSubmit 함수 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            // discountRate 값이 문자열이 아닌 숫자로 확실하게 변환
            const discountRateNum = parseInt(discountRate, 10);
            console.log("Sending discount rate:", discountRateNum); // 로그 추가

            const couponData = {
                companyName: selectedCompany,
                discountRate: discountRateNum, // 명시적으로 변환된 숫자 사용
                duration: parseInt(duration, 10),
                couponName: couponName
            };

            console.log("Sending coupon data:", couponData); // 전송 데이터 로깅
            await adminAPI.coupon.issueCoupon(couponData);
            setSuccess("쿠폰 발급에 성공했습니다!");

            // Reset form
            setSelectedCompany("");
            setDiscountRate("");
            setDuration("");
            setCouponName("");
        } catch (error) {
            console.error("Error issuing coupon:", error);
            setError("Failed to issue coupon. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">쿠폰 발행</h2>
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                {/* Coupon Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Brand Name (Company) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium text-neutral-700">
                            브랜드명
                        </label>
                        <div className="relative">
                            <div 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
                            >
                                <span>{selectedCompany || "Select a brand"}</span>
                                <span>▼</span>
                            </div>
                            {showDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {loading ? (
                                        <div className="px-4 py-2 text-gray-500">Loading...</div>
                                    ) : companies.length === 0 ? (
                                        <div className="px-4 py-2 text-gray-500">No companies found</div>
                                    ) : (
                                        companies.map((companyName, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedCompany(companyName);
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                {companyName}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Discount Rate */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium text-neutral-700">
                            할인율
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={discountRate}
                                onChange={(e) => setDiscountRate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                                placeholder="Enter discount rate (1-99)"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                %
                            </span>
                        </div>
                    </div>

                    {/* Duration (Days) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium text-neutral-700">
                            사용기한 (Days)
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter duration in days"
                        />
                    </div>

                    {/* Coupon Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium text-neutral-700">
                            쿠폰 이름
                        </label>
                        <input
                            type="text"
                            value={couponName}
                            onChange={(e) => setCouponName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter coupon name"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-8 py-4 ${
                                submitting 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-neutral-800 hover:bg-neutral-900"
                            } text-white text-xl font-semibold rounded-2xl transition-colors`}
                        >
                            {submitting ? "Issuing..." : "쿠폰 발행"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}