import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BETA_URL = 'https://lifeverse-1stayz-demo1.bolt.host/beta';

export function BetaQRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Decorative background accents */}
      <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-amber-100/60 blur-3xl" />
      <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full bg-stone-200/50 blur-3xl" />

      <img src="/LVHI_1Stayz.png" alt="1Stayz" className="h-40 mb-8 drop-shadow-sm relative z-10" />

      <div className="bg-white border border-stone-200 rounded-3xl p-10 flex flex-col items-center shadow-lg relative z-10">
        <QRCodeSVG
          value={BETA_URL}
          size={240}
          bgColor="#ffffff"
          fgColor="#1c1917"
          level="M"
          includeMargin={false}
        />
      </div>

      <h1 className="text-2xl font-bold text-stone-900 mt-8 text-center tracking-tight relative z-10">Scan to Join the Beta</h1>
      <p className="text-sm text-stone-500 mt-2 text-center max-w-xs leading-relaxed relative z-10">
        Point your phone camera here to sign up for early access to 1Stayz in under 30 seconds.
      </p>

      <p className="text-xs text-stone-300 mt-8 relative z-10">{BETA_URL}</p>

      <Link to="/login" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition mt-4 relative z-10">
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      <div className="mt-10 relative z-10">
        <img src="/LifeversLogo.png" alt="Lifeverse Holdings" className="h-14 w-auto opacity-50" />
      </div>
    </div>
  );
}
