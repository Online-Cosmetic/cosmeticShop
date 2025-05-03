function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 text-sm mt-10">
            <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
                <p className="mb-2 sm:mb-0">&copy; 2025 cosMall. All rights reserved.</p>
                <div className="flex space-x-4">
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Contact</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;