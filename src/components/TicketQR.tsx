type TicketQRProps = {
  code: string;
};

export default function TicketQR({ code }: TicketQRProps) {
  return (
    <div className="grid aspect-square place-items-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="grid h-full w-full place-items-center rounded-[1.5rem] bg-[linear-gradient(45deg,#0f172a_25%,transparent_25%),linear-gradient(-45deg,#0f172a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0f172a_75%),linear-gradient(-45deg,transparent_75%,#0f172a_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] p-4 dark:bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)]">
        <div className="rounded-2xl bg-white/95 px-6 py-4 text-center shadow-lg dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ArenaTicket</p>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{code}</p>
        </div>
      </div>
    </div>
  );
}
