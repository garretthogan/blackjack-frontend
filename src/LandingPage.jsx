import React from 'react';
import { useNavigate } from 'react-router';

/**
 * Blackjack Landing Page (React + Tailwind)
 * - Single-file component
 * - Responsive, accessible, keyboard-friendly
 * - Matches the grayscale wireframe structure
 */
export default function LandingPage() {
  const handleQuickPlay = () =>
    alert('Quick Play: joining a low-stakes table...');
  const handleChooseTable = () =>
    alert('Open table picker modal (not implemented)');
  const handleSignIn = () => alert('Open sign-in (not implemented)');
  const handlePlayTier = tier => () =>
    alert(`Joining ${tier} stakes table...`);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg " aria-hidden />
            <span className="font-semibold tracking-tight cursor-pointer">
              Blackjack
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <button
              className="rounded-lg border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100"
              onClick={() => alert('Open settings')}
            >
              Settings
            </button>
            <button
              className="rounded-lg border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100"
              onClick={() => alert('Show how to play overlay')}
            >
              How to Play
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl">
          ROGUELIKE BLACKJACK
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center ">
          Jump in with Quick Play or choose a table that fits your stakes.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-zinc-600">
          <button
            onClick={() => {
              navigate('/blackjack');
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Quick Play
          </button>
          <button
            onClick={() => {
              navigate('/seat-buy-in');
            }}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Choose Table
          </button>
          <button
            onClick={() => {}}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Table Presets */}
      {/* <section className="mx-auto max-w-4xl px-4 pb-20">
                <h2 className="mb-4 text-lg font-semibold tracking-tight">Table Presets</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                    <PresetCard
                        title="Low Stakes"
                        range="$1–$10"
                        onPlay={handlePlayTier("low")}
                    />
                    <PresetCard
                        title="Mid Stakes"
                        range="$10–$100"
                        onPlay={handlePlayTier("mid")}
                    />
                    <PresetCard
                        title="High Stakes"
                        range="$100+"
                        onPlay={handlePlayTier("high")}
                    />
                    <PresetCard
                        title="Custom Rules"
                        range="Set decks, S17/H17, DAS, RSA, Surrender"
                        onPlay={() => alert("Open custom table creator")}
                    />
                </ul>
            </section> */}

      {/* Footer */}
      <footer className="border-t ">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500"></div>
      </footer>
    </div>
  );
}

function PresetCard({ title, range, onPlay }) {
  return (
    <li className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-zinc-500">{range}</div>
      </div>
      <button
        onClick={onPlay}
        className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        aria-label={`Play ${title}`}
      >
        Play
      </button>
    </li>
  );
}
