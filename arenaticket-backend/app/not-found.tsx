import Link from "next/link";
import StatusScreen from "./admin/_components/StatusScreen";

export default function NotFound() {
    return (
        <StatusScreen
            code="404"
            title="Page not found"
            description="The page you’re looking for doesn’t exist or may have been moved."
        >
            <Link
                href="/"
                className="flex h-10 items-center bg-on-dark px-4 text-xs font-bold uppercase tracking-[1.5px] text-canvas transition-opacity hover:opacity-90"
            >
                Back home
            </Link>
        </StatusScreen>
    );
}
