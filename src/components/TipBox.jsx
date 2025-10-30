export default function TipBox({ title = "Tip", children }) {
  return (
    <div className="mt-5 rounded-xl border border-pink-500/30 bg-pink-500/10 p-4">
      <div className="text-sm font-semibold text-pink-300">{title}</div>
      <div className="mt-1 text-sm text-gray-200">{children}</div>
    </div>
  );
}