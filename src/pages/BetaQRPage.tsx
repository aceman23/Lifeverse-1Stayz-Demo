import { QRCodeSVG } from 'qrcode.react';

const BETA_URL = 'https://lifeverse-1stayz-demo1.bolt.host/beta';

export function BetaQRPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <img src="/LVHI_1Stayz.png" alt="1Stayz" className="h-12 mb-8" />

      <div className="bg-stone-50 border border-stone-200 rounded-3xl p-10 flex flex-col items-center shadow-sm">
        <QRCodeSVG
          value={BETA_URL}
          size={260}
          bgColor="#fafaf9"
          fgColor="#1c1917"
          level="M"
          includeMargin={false}
        />
      </div>

      <h1 className="text-2xl font-bold text-stone-900 mt-8 text-center">Scan to Join the Beta</h1>
      <p className="text-sm text-stone-500 mt-2 text-center max-w-xs">
        Point your phone camera here to sign up for early access to 1Stayz in under 30 seconds.
      </p>

      <p className="text-xs text-stone-300 mt-10">{BETA_URL}</p>
    </div>
  );
}
