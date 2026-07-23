type TicketQRProps = {
  code: string;
};

export default function TicketQR({ code }: TicketQRProps) {
  return (
    <div className="grid aspect-square place-items-center rounded-[2rem] border border-dashed border-indigo-300 bg-white p-7 dark:border-indigo-800">
      <QRCodeSVG value={code} size={240} level="H" marginSize={2} className="h-full w-full max-w-60" />
    </div>
  );
}
import { QRCodeSVG } from "qrcode.react";
