import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import './RentalTracker.css';

const STEPS = [
  { key: 'Matching',   label: 'Menunggu Kurir',   icon: Clock,        desc: 'Kurir sedang dikonfirmasi untuk mengambil barang.' },
  { key: 'Delivering', label: 'Dalam Perjalanan',  icon: Truck,        desc: 'Kurir sedang mengantar barang ke alamat kamu.' },
  { key: 'Active',     label: 'Sedang Disewa',     icon: Package,      desc: 'Barang sudah sampai! Masa sewa sedang berjalan.' },
  { key: 'Completed',  label: 'Selesai',           icon: CheckCircle2, desc: 'Barang telah dikembalikan. Jaminan sudah dikembalikan.' },
];

const ORDER = ['Matching', 'Delivering', 'Active', 'Completed'];

export default function RentalTracker({ status }) {
  const currentIdx = ORDER.indexOf(status);

  return (
    <div className="rental-tracker">
      {STEPS.map((step, idx) => {
        const StepIcon = step.icon;
        const done    = idx < currentIdx;
        const current = idx === currentIdx;
        const future  = idx > currentIdx;

        return (
          <div key={step.key} className={`tracker-step ${done ? 'done' : ''} ${current ? 'current' : ''} ${future ? 'future' : ''}`}>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className={`tracker-line ${idx < currentIdx ? 'done' : ''}`} />
            )}

            {/* Icon circle */}
            <div className="tracker-icon-wrap">
              {current && <div className="tracker-pulse" />}
              <div className="tracker-icon">
                <StepIcon size={16} />
              </div>
            </div>

            {/* Label */}
            <div className="tracker-label">
              <span className="tracker-label-title">{step.label}</span>
              {current && <p className="tracker-label-desc">{step.desc}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
