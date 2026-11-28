export function Stat({ icon, tone = '', value, label, hint }) {
  return (
    <div className="card stat">
      <span className={`stat-icon ${tone}`}><i className={`bi ${icon}`} /></span>
      <div><strong>{value}</strong><span>{label}</span>{hint && <small>{hint}</small>}</div>
    </div>
  );
}

export function Pill({ children, tone = 'gray' }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

export function Empty({ text }) {
  return <div className="empty"><i className="bi bi-inbox" style={{ display: 'block', fontSize: 26, marginBottom: 8 }} />{text}</div>;
}

export function Modal({ title, subtitle, onClose, children, footer }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <div><h3>{title}</h3>{subtitle && <small>{subtitle}</small>}</div>
          <button type="button" className="icon-btn" aria-label="Tutup" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-foot">{footer || <button type="button" className="btn" onClick={onClose}>Tutup</button>}</div>
      </div>
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return <div className="toast" role="status"><i className="bi bi-check-circle" style={{ marginRight: 8 }} />{message}</div>;
}

export function SectionTitle({ icon, children, step }) {
  return (
    <h3 className="section-title">
      <i className={`bi ${icon}`} /> {children} {step && <span className="step">{step}</span>}
    </h3>
  );
}
