// src/pages/admin/AdminAitemsDataset.jsx
import React from "react";
import { adminAPI } from "../../utils/customAxios";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function AdminAitemsDataset() {
    const handleDownload = async (datasetType, filename) => {
        try {
            let response;
            if (datasetType === 'user') {
                response = await adminAPI.aitems.downloadUserDataset();
            } else if (datasetType === 'item') {
                response = await adminAPI.aitems.downloadItemDataset();
            } else if (datasetType === 'interaction') {
                response = await adminAPI.aitems.downloadInteractionDataset();
            }
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`${filename} 다운로드 실패:`, error);
            alert('다운로드에 실패했습니다.');
        }
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow">
                <h2 className="text-3xl font-bold text-neutral-800 mb-8">AiTEMS 데이터셋 추출</h2>
                
                <div className="space-y-4">
                    <button
                        onClick={() => handleDownload('user', 'user_dataset.csv')}
                        className="w-full flex items-center gap-3 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                        <div>
                            <div className="font-semibold text-gray-800">User Dataset</div>
                            <div className="text-sm text-gray-500">사용자 데이터 CSV 파일 다운로드</div>
                        </div>
                    </button>
                    
                    <button
                        onClick={() => handleDownload('item', 'item_dataset.csv')}
                        className="w-full flex items-center gap-3 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                        <div>
                            <div className="font-semibold text-gray-800">Item Dataset</div>
                            <div className="text-sm text-gray-500">상품 데이터 CSV 파일 다운로드</div>
                        </div>
                    </button>
                    
                    <button
                        onClick={() => handleDownload('interaction', 'interaction_dataset.csv')}
                        className="w-full flex items-center gap-3 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                        <div>
                            <div className="font-semibold text-gray-800">Interaction Dataset</div>
                            <div className="text-sm text-gray-500">상호작용 데이터 CSV 파일 다운로드</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

