// /app/components/layout/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="bg-gray-100 w-64 p-4">
            <nav>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/"
                            className="block px-4 py-2 rounded hover:bg-gray-200"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/units"
                            className="block px-4 py-2 rounded hover:bg-gray-200"
                        >
                            Units
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/lessons"
                            className="block px-4 py-2 rounded hover:bg-gray-200"
                        >
                            Lessons
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/standards"
                            className="block px-4 py-2 rounded hover:bg-gray-200"
                        >
                            Standards
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/weekly-plans"
                            className="block px-4 py-2 rounded hover:bg-gray-200"
                        >
                            Weekly Plans
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}