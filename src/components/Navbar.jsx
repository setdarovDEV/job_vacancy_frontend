import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">HeadHunter</Link>
            <div className="space-x-4">
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
            </div>
        </nav>
    );
}

