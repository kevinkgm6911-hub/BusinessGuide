export default function DownloadCard({ title, description, file, note }) {
  return (
    <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
      {title && <h4 className="text-lg font-semibold">{title}</h4>}
      {description && <p className="mt-1 text-gray-300">{description}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={file}
          download
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 text-sm font-semibold shadow-lg shadow-orange-500/20 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
        >
          📥 Download
        </a>
        {note && <span className="text-xs text-gray-400">{note}</span>}
      </div>
    </div>
  );
}
