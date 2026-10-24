export default function LoadingState({ label = 'Loading your data…' }) {
  return <div className="loading-state"><span className="spinner" />{label}</div>
}
