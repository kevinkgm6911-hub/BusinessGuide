// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    display_name: "",
    experience_level: "",
    focus_area: "",
    current_goal: "",
    notes: "",
  });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      nav("/start");
    }
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      setStatus("Loading your profile…");
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile", error);
        setStatus("Unable to load profile right now.");
        return;
      }

      if (data) {
        setForm({
          display_name: data.display_name || "",
          experience_level: data.experience_level || "",
          focus_area: data.focus_area || "",
          current_goal: data.current_goal || "",
          notes: data.notes || "",
        });
        setStatus("");
      } else {
        setStatus("No profile yet — tell the coach a bit about you.");
      }
    }

    fetchProfile();
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setStatus("");

    const payload = {
      user_id: user.id,
      display_name: form.display_name || null,
      experience_level: form.experience_level || null,
      focus_area: form.focus_area || null,
      current_goal: form.current_goal || null,
      notes: form.notes || null,
    };

    const { error } = await supabase
      .from("user_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.error("Error saving profile", error);
      setStatus("Error saving profile. Please try again.");
    } else {
      setStatus(
        "Profile saved. The coach will use this to personalize responses."
      );
    }
    setSaving(false);
  }

  if (loading || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4 text-gray-300">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-gray-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Your Profile
        </h1>
        <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
          This is what the Side Hustle Starter Coach knows about you. Update it
          to get more tailored advice.
        </p>

        {status && (
          <div className="mb-4 text-xs sm:text-sm text-gray-300">{status}</div>
        )}

        <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Name or what you prefer to be called
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, display_name: e.target.value }))
              }
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Example: Kevin, Kev, or your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Experience level with business
            </label>
            <select
              value={form.experience_level}
              onChange={(e) =>
                setForm((f) => ({ ...f, experience_level: e.target.value }))
              }
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select one…</option>
              <option value="complete beginner">Complete beginner</option>
              <option value="have tried a few things">I’ve tried a few things</option>
              <option value="have a small business already">
                I already have a small business
              </option>
              <option value="experienced entrepreneur">
                Experienced entrepreneur
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              What you’re mostly interested in building
            </label>
            <input
              type="text"
              value={form.focus_area}
              onChange={(e) =>
                setForm((f) => ({ ...f, focus_area: e.target.value }))
              }
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Example: Etsy merch, freelance design, digital products, local services"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Your main goal for the next 3–6 months
            </label>
            <input
              type="text"
              value={form.current_goal}
              onChange={(e) =>
                setForm((f) => ({ ...f, current_goal: e.target.value }))
              }
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Example: make $300/month, launch my first offer, get 5 paying clients"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Anything else the coach should know
            </label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Constraints, schedule, preferences, neurodivergence, anything that affects how you like to work."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
