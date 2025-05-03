// components/Header.jsx
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-gray-100 border-b border-gray-300">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <Link to="/" className="text-xl text-black">cosMall</Link>
                <nav className="flex space-x-4">
                    <Link to="/detail" className="text-gray-500 no-underline">Category</Link>
                    <Link to="/event" className="text-gray-500 no-underline">Event</Link>
                    <Link to="/faq" className="text-gray-500 no-underline">FAQ</Link>
                </nav>
            </div>
        </header>
    );
}