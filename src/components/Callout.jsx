export default function Callout({ type="info", title, children }) {
  const styles = {
    info:    "border-sky-500/30 bg-sky-500/10 text-sky-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    warn:    "border-amber-500/30 bg-amber-500/10 text-amber-200",
  }[type];
  return (
    <div className={`mt-5 rounded-xl border p-4 ${styles}`}>
      {title && <div className="text-sm font-semibold mb-1">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}