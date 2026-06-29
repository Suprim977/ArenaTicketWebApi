import DashboardHeader from "./_components/DashboardHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="p-4 sm:p-6 lg:p-8 bg-light min-h-screen text-on-dark flex flex-col gap-8  mx-auto w-full max-w-[1440px]">
            
            <DashboardHeader/>
            
            <main className="flex-1">
                {children}
            </main>
            {/* Footer */}
            <footer className="text-center text-sm text-muted">
                &copy; {new Date().getFullYear()} My App. All rights reserved.
            </footer>
        </section>
    );
}