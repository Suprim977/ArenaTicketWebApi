import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

type TicketQRProps = {
  code: string;
  qrCodeData?: string;
};

export default function TicketQR({ code, qrCodeData }: TicketQRProps) {
  return (
    <div className="grid aspect-square place-items-center rounded-4xl border border-dashed border-indigo-300 bg-white p-7 dark:border-indigo-800">
      {qrCodeData && (/^data:image\//i.test(qrCodeData) || /^https?:\/\//i.test(qrCodeData))
        ? <Image unoptimized src={qrCodeData} alt="Ticket QR code" width={240} height={240} className="h-full w-full max-w-60 object-contain" />
        : <QRCodeSVG value={qrCodeData || code} size={240} level="H" marginSize={2} className="h-full w-full max-w-60" />}
    </div>
  );
}
