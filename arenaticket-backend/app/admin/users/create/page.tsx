import Link from "next/link";
import UserForm from "../_components/UserForm";

export default function Page() {
    return (
        <section>
            <Link href="/admin/users" className="text-xs uppercase tracking-[1.5px] text-muted hover:text-on-dark">
                ← Back to users
            </Link>
            <h2 className="mb-8 mt-4 text-3xl font-bold text-on-dark">New user</h2>
            <UserForm />
        </section>
    );
}
