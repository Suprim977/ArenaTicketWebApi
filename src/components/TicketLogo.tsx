export default function TicketLogo({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Purple Ticket Icon */}
      <div className="w-24 h-24 bg-gradient-to-b from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg mb-4 relative">
        {/* Inner circle detail */}
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        {/* Notches on sides */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">ArenaTicket</h2>
    </div>
  );
}