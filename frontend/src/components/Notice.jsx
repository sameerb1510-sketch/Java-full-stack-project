export default function Notice({ tone = 'error', children, onDismiss }) {
  if (!children) return null
  return (
    <div className={`notice notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <span>{tone === 'error' ? '!' : '✓'}</span>
      <div>{children}</div>
      {onDismiss && <button className="notice-dismiss" type="button" aria-label="Dismiss message" onClick={onDismiss}>×</button>}
    </div>
  )
}
