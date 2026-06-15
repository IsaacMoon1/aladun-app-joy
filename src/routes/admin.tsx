import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Store,
  Utensils,
  X,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { partnerStore, usePartners, type Partner, type PartnerStatus } from "@/lib/partner-store";
import { formatNaira } from "@/lib/aladun-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Aladùn" }] }),
  component: AdminPage,
});

const tabs: { key: PartnerStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

function AdminPage() {
  const navigate = useNavigate();
  const { partners } = usePartners();
  const [tab, setTab] = useState<PartnerStatus>("pending");
  const [selected, setSelected] = useState<Partner | null>(null);

  const counts = useMemo(
    () => ({
      pending: partners.filter((p) => p.status === "pending").length,
      approved: partners.filter((p) => p.status === "approved").length,
      rejected: partners.filter((p) => p.status === "rejected").length,
    }),
    [partners]
  );

  const filtered = partners.filter((p) => p.status === tab);

  const act = (p: Partner, status: PartnerStatus) => {
    partnerStore.setStatus(p.id, status);
    toast.success(
      status === "approved" ? `${p.storeName} approved` : `${p.storeName} rejected`
    );
    setSelected(null);
  };

  return (
    <PhoneShell showNav={false}>
      <div className="bg-gradient-brand px-6 pt-12 pb-8 text-primary-foreground">
        <button
          onClick={() => navigate({ to: "/profile" })}
          className="mb-4 grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <h1 className="text-2xl font-extrabold">Admin dashboard</h1>
        </div>
        <p className="text-xs opacity-90">Review and approve restaurant partners.</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat label="Pending" value={counts.pending} icon={<Clock className="h-4 w-4" />} />
          <Stat label="Approved" value={counts.approved} icon={<CheckCircle2 className="h-4 w-4" />} />
          <Stat label="Rejected" value={counts.rejected} icon={<XCircle className="h-4 w-4" />} />
        </div>
      </div>

      <div className="px-6 pt-5">
        <div className="flex gap-2 rounded-2xl bg-muted/60 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                tab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-3 pb-8">
          {filtered.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border py-10 text-center text-xs text-muted-foreground">
              No {tab} applications
            </li>
          )}
          {filtered.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setSelected(p)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-card"
              >
                <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-primary-soft text-primary">
                  {p.logo ? (
                    <img src={p.logo} alt={p.storeName} className="h-full w-full object-cover" />
                  ) : (
                    <Store className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-extrabold">{p.storeName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.cuisine} · {p.area}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {p.menu.length} menu item{p.menu.length !== 1 && "s"}
                  </p>
                </div>
                <StatusPill status={p.status} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card md:rounded-3xl"
          >
            <div className="relative">
              <div className="h-32 w-full overflow-hidden bg-primary-soft">
                {selected.cover && (
                  <img src={selected.cover} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/90"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute -bottom-6 left-5 grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-primary-soft text-primary shadow-card">
                {selected.logo ? (
                  <img src={selected.logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Store className="h-7 w-7" />
                )}
              </div>
            </div>

            <div className="px-5 pt-9 pb-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">{selected.storeName}</h2>
                  <p className="text-xs text-muted-foreground">{selected.cuisine}</p>
                </div>
                <StatusPill status={selected.status} />
              </div>

              <p className="mt-3 text-sm text-foreground/80">{selected.description}</p>

              <div className="mt-4 space-y-2 text-xs">
                <Row icon={<MapPin className="h-3.5 w-3.5" />}>
                  {selected.address} · {selected.area}
                </Row>
                <Row icon={<Phone className="h-3.5 w-3.5" />}>{selected.phone}</Row>
                <Row icon={<Mail className="h-3.5 w-3.5" />}>{selected.email}</Row>
                <Row icon={<Store className="h-3.5 w-3.5" />}>Owner: {selected.ownerName}</Row>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-bold text-muted-foreground">
                  Menu ({selected.menu.length})
                </p>
                <ul className="space-y-2">
                  {selected.menu.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl border border-border p-2"
                    >
                      <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-primary-soft text-primary">
                        {m.image ? (
                          <img src={m.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Utensils className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 text-sm font-semibold">{m.name}</div>
                      <div className="text-sm font-bold">{formatNaira(m.price)}</div>
                    </li>
                  ))}
                </ul>
              </div>

              {selected.status === "pending" && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => act(selected, "rejected")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 py-3 text-sm font-bold text-destructive"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => act(selected, "approved")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-brand"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                </div>
              )}
              {selected.status !== "pending" && (
                <button
                  onClick={() => act(selected, "pending")}
                  className="mt-6 w-full rounded-2xl border border-border py-3 text-sm font-bold"
                >
                  Move back to pending
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-primary-foreground/15 p-3">
      <div className="flex items-center gap-1.5 opacity-90">
        {icon}
        <span className="text-[10px] font-bold">{label}</span>
      </div>
      <p className="mt-1 text-xl font-extrabold">{value}</p>
    </div>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-primary">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function StatusPill({ status }: { status: PartnerStatus }) {
  const styles =
    status === "approved"
      ? "bg-primary/15 text-primary"
      : status === "rejected"
      ? "bg-destructive/15 text-destructive"
      : "bg-accent/15 text-accent";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${styles}`}>
      {status}
    </span>
  );
}
