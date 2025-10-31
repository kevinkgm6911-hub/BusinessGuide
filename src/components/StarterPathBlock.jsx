import { Link } from "react-router-dom";
import { percentComplete, nextIncomplete } from "../lib/progress";

export default function StarterPathBlock() {
  const pct = percentComplete();
  const next = nextIncomplete();

  return (
    <section className="mx-auto max-w-6xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold">Starter Path</h3>
          <p className="text-sm text-gray-300">
            A 5-step mini-course to go from idea → launch.
          </p>
          <div className="mt-3 h-2 w-64 max-w-full rounded-full bg-neutral-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">{pct}% complete</p>
        </div>
        <div className="flex gap-3">
          {next && (
            <Link
              to={`/resources/${next}`}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold hover:bg-orange-700"
            >
              Continue →
            </Link>
          )}
          <Link
            to="/start"
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-600"
          >
            View path
          </Link>
        </div>
      </div>
    </section>
  );
}
