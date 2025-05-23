import React from 'react';

export default function NavItem({ section, selected, onSelect }) {
    const isActive = selected === section.key;
    return (
        <div
            className={`px-2 py-1 cursor-pointer rounded ${isActive ? 'bg-gray-200 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => onSelect(section.key)}
        >
            {section.label}
        </div>
    );
}