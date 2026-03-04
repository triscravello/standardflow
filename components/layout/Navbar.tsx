// /app/components/layout/Navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-4">
                <li>
                    <Link
                        href="/"
                        className="hover:text-gray-300"
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        href="/units"
                        className="hover:text-gray-300"
                    >
                        Units
                    </Link>
                </li>
                <li>
                    <Link
                        href="/lessons"
                        className="hover:text-gray-300"
                    >
                        Lessons
                    </Link>
                </li>
                <li>
                    <Link
                        href="/standards"
                        className="hover:text-gray-300"
                    >
                        Standards
                    </Link>
                </li>
                <li>
                    <Link
                        href="/weekly-plans"
                        className="hover:text-gray-300"
                    >
                        Weekly Plans
                    </Link>
                </li>
            </ul>
        </nav>
    )
}