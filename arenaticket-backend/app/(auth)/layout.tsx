import Image from "next/image";
import Link from "next/link";
import authImage from "@/app/assets/image.png";
import Logo from "@/app/_components/Logo";

// Shared auth shell — split surface: full-bleed photography panel + form panel.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-canvas lg:grid-cols-2">
      {/* Photography panel — the brand voltage. Hidden on mobile. */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src={authImage}
          alt="Image"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/30 to-transparent" />
        <div className="absolute left-10 top-10">
          <Logo />
        </div>
        <div className="absolute bottom-12 left-10 right-10">
          <h2 className="text-4xl font-bold uppercase leading-none text-on-dark">
            The ultimate
            <br />
            App
          </h2>
          <p className="mt-4 max-w-md text-base font-light text-body-strong">
            Sign in my app
          </p>
        </div>
      </aside>

      <main className="flex flex-col">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5 lg:hidden">
          <Logo />
          <Link
            href="/"
            className="text-xs uppercase tracking-[1.5px] text-muted transition-colors hover:text-on-dark"
          >
            ← Home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
