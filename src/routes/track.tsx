import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Phone, MessageCircle, ChefHat, Bike, PackageCheck, Receipt } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import scooter from "@/assets/scooter.png";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track Order — Aladùn" }] }),
  component: TrackPage,
});

const steps = [
  { id: 0, label: "Order Confirmed", desc: "We've received your order.", icon: Receipt },
  { id: 1, label: "Preparing your food", desc: "Aladùn Kitchen is cooking.", icon: ChefHat },
  { id: 2, label: "Rider on the way", desc: "Tunde is heading to you.", icon: Bike },
  { id: 3, label: "Delivered", desc: "Enjoy your meal!", icon: PackageCheck },
];

function TrackPage() {
  const [stage, setStage] = useState(0);
  const [eta, setEta] = useState(28);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage((s) => (s < 3 ? s + 1 : s));
    }, 4500);
    const etaInterval = setInterval(() => {
      setEta((e) => (e > 1 ? e - 1 : e));
    }, 1500);
    return () => {
      clearInterval(stageInterval);
      clearInterval(etaInterval);
    };
  }, []);

  const progress = ((stage + 1) / steps.length) * 100;
  const delivered = stage === 3;

  return (
    <PhoneShell>
      {/* Map-style hero */}
      <div className="relative h-64 overflow-hidden bg-gradient-brand">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
        <div className="pointer-events-none absolute -top-12 right-0 h-44 w-44 rounded-full bg-primary-foreground/20 blur-3xl" />

        {/* Route line */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 256" preserveAspectRatio="none">
          <path
            d="M40 200 C 120 100, 240 220, 360 60"
            stroke="oklch(1 0 0 / 0.7)"
            strokeWidth="3"
            strokeDasharray="8 8"
            fill="none"
          />
        </svg>

        <div className="absolute left-10 bottom-12 grid h-7 w-7 place-items-center rounded-full bg-primary-foreground text-primary text-xs font-extrabold shadow-card">
          A
        </div>
        <div className="absolute right-10 top-10 grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-extrabold shadow-card">
          B
        </div>

        <img
          src={scooter}
          alt=""
          className="absolute h-20 w-auto drop-shadow-xl transition-all duration-700 ease-out"
          style={{
            left: `${10 + progress * 0.7}%`,
            top: `${130 - stage * 18}px`,
          }}
        />

        <Link
          to="/home"
          className="absolute left-5 top-12 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-foreground shadow-card backdrop-blur"
        >
          <span className="text-lg leading-none">←</span>
        </Link>
      </div>

      {/* ETA card */}
      <div className="-mt-10 px-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {delivered ? "Delivered" : "Estimated arrival"}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-primary">
                {delivered ? "On time 🎉" : `${eta} mins`}
              </p>
            </div>
            <span className="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary">
              #ALD-{Math.floor(Math.random() * 9000 + 1000)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Rider strip */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-primary-soft p-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground font-extrabold">
              TA
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Tunde A. · Your rider</p>
              <p className="text-[11px] text-muted-foreground">Honda · ABC-234-XY</p>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-surface text-primary shadow-card">
              <MessageCircle className="h-4 w-4" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-brand">
              <Phone className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status timeline */}
      <div className="mt-6 px-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Order status
        </p>
        <ol className="mt-4 space-y-1">
          {steps.map((s, i) => {
            const done = i <= stage;
            const current = i === stage && !delivered;
            const Icon = s.icon;
            return (
              <li key={s.id} className="relative flex gap-4 pb-5 last:pb-0">
                {i < steps.length - 1 && (
                  <span
                    className={`absolute left-[19px] top-10 h-full w-0.5 ${
                      i < stage ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
                <span
                  className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done && !current ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  {current && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                  )}
                </span>
                <div className="flex-1 pt-1">
                  <p
                    className={`text-sm font-bold ${
                      done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                </div>
                {done && (
                  <span className="pt-1 text-[10px] font-bold text-primary">Done</span>
                )}
              </li>
            );
          })}
        </ol>

        {delivered ? (
          <Link
            to="/home"
            className="mt-4 block w-full rounded-2xl bg-primary py-4 text-center text-sm font-bold text-primary-foreground shadow-brand"
          >
            Order again
          </Link>
        ) : (
          <button className="mt-4 w-full rounded-2xl border border-border bg-card py-4 text-sm font-bold">
            Need help with this order?
          </button>
        )}
      </div>
    </PhoneShell>
  );
}
