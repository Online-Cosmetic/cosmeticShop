import React from 'react';

export default function NavItem({ section, selected, onSelect }) {
  const isSelected = section.key === selected;

  return (
    <li>
      <button
        onClick={() => onSelect(section.key)}
        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
          isSelected
            ? 'bg-emerald-100 text-emerald-800 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {section.icon && <span>{section.icon}</span>}
        <span>{section.label}</span>
      </button>
    </li>
  );
}
