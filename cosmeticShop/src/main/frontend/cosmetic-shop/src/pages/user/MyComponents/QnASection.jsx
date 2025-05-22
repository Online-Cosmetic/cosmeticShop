import React from 'react';

export default function QnASection({ items }) {
  const formatDate = iso => new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Q&A</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-t border-gray-300 text-sm">
          <thead>
            <tr className="border-b">
              {['#','State','Title','Author','Date'].map(h => <th key={h} className="p-2 text-left">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map((qna, idx) => (
              <tr key={qna.id} className="border-b">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{qna.answered ? 'Answered' : 'Pending'}</td>
                <td className="p-2">{qna.questionTitle}</td>
                <td className="p-2">{qna.nickname}</td>
                <td className="p-2">{formatDate(qna.questionedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
