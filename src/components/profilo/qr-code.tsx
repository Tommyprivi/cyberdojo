"use client";

import qrcode from "qrcode-generator";
import { useMemo } from "react";

/**
 * QR code disegnato nel browser come SVG: il contenuto (che include la chiave segreta) non esce mai dal
 * dispositivo e non passa da nessun servizio esterno. Sempre nero su bianco, con il margine richiesto
 * dalla norma, anche in tema scuro: così le fotocamere lo leggono.
 */
export function QrCode({ value, label }: { value: string; label: string }) {
  const { size, path } = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    const quiet = 4;
    let d = "";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) if (qr.isDark(y, x)) d += `M${x + quiet} ${y + quiet}h1v1h-1z`;
    }
    return { size: n + quiet * 2, path: d };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className="size-full max-h-56 max-w-56 rounded-md border border-border bg-white"
    >
      <rect width={size} height={size} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}
