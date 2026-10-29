import Modal from './Modal.jsx';

// Only the first three are live for now; the rest show as "Coming soon".
const OPTIONS = [
  { key: 'bank', label: 'Banks & Brokerages', tag: 'Auto-Synced', icon: '🏛️', tint: '#e0efff', live: true },
  { key: 'manual', label: 'Manual Accounts', tag: 'Manual', icon: '📋', tint: '#dbe9ff', live: true },
  { key: 'crypto', label: 'Crypto & Wallets', tag: 'Auto-Synced', icon: '₿', tint: '#fff1d6' },
  { key: 'real_estate', label: 'Real Estate', tag: 'Manual', icon: '🏠', tint: '#d7f5e6', live: true },
  { key: 'positions', label: 'Add Manual Positions', tag: 'Manual', icon: '⇅', tint: '#ffe8dc' },
  { key: 'alternative', label: 'Alternative', tag: 'Manual', icon: '🌳', tint: '#dcf3d9' },
  { key: 'valuable', label: 'Valuable Assets', tag: 'Manual', icon: '💎', tint: '#ffdff0' },
  { key: 'debt', label: 'Debt', tag: 'Manual', icon: '🏷️', tint: '#ffe0e3' },
];

export default function AddModal({ onClose, onPick }) {
  return (
    <Modal title="＋ Add Assets & Investments" onClose={onClose} wide>
      <div className="add-grid">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            className={`add-tile${o.live ? '' : ' off'}`}
            disabled={!o.live}
            onClick={() => onPick(o.key)}
          >
            <span className="add-icon" style={{ background: o.tint }} aria-hidden="true">{o.icon}</span>
            <span className="add-label">{o.label}</span>
            <span className="add-arrow" aria-hidden="true">{o.live ? '→' : ''}</span>
            <span className="add-tag">{o.live ? o.tag : 'Coming soon'}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
