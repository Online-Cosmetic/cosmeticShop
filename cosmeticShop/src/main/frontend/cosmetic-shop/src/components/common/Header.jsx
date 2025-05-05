// components/Header.jsx
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            <nav className="flex justify-end border-b border-gray-300">
                <div className="flex space-x-10 py-2 pr-6 text-gray-500">
                        <span onClick={"/"}>Sign Up</span>
                        <span>Sign In</span>
                        <span>My Page</span>
                        <span>Cart</span>
                        <span>Q&A</span>
                </div>
            </nav>
            <nav className="container mx-auto flex items-center justify-between py-4 px-6 border-b border-gray-300">
                <Link to="/" className="text-2xl text-black">cosMall</Link>
                <div className="flex space-x-4 text-gray-500">
                    <Link to="/detail" className="no-underline">Category</Link>
                    <Link to="/event" className="no-underline">Event</Link>
                    <Link to="/faq" className="no-underline">FAQ</Link>
                </div>
            </nav>
            <nav className="border-b border-gray-300">
                <div className="flex justify-center space-x-10 py-2 text-xl">
                    <span>Makeup</span>
                    <span>Skincare</span>
                    <span>Hair</span>
                    <span>Body</span>
                </div>
            </nav>
        </header>
    );
}