import Logo from "@/app/__components/Logo";
import ProfilePanel from "@/components/ProfilePanel";

export default function ProfilePage() {
  return <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6"><div className="mx-auto mb-8 max-w-4xl"><Logo /></div><ProfilePanel /></main>;
}
