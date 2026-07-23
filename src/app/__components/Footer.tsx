export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-gray-500">
        ArenaTicket © {new Date().getFullYear()} | Buy tickets, manage bookings, and stay ready for game day.
      </div>
    </footer>
  );
}
