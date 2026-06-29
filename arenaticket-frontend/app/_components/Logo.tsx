export default function Logo() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white shadow-sm">
        <span className="text-lg">🎟</span>
      </div>
      <div>
        <p className="text-lg font-extrabold text-gray-900">ArenaTicket</p>
        <p className="text-xs tracking-[0.14em] text-gray-500">ESPORTS ACCESS PASS</p>
      </div>
    </div>
  );
}
