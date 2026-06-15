import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ImagePlus,
  Plus,
  Store,
  Trash2,
  Utensils,
} from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { partnerStore, type MenuItemDraft } from "@/lib/partner-store";
import { formatNaira } from "@/lib/aladun-data";

export const Route = createFileRoute("/partner")({
  head: () => ({ meta: [{ title: "Become a partner — Aladùn" }] }),
  component: PartnerPage,
});

type Step = 0 | 1 | 2 | 3;

function PartnerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);

  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<string | undefined>();
  const [cover, setCover] = useState<string | undefined>();
  const [menu, setMenu] = useState<MenuItemDraft[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState<string | undefined>();

  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const itemImgRef = useRef<HTMLInputElement>(null);

  const readFile = (f: File) =>
    new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.readAsDataURL(f);
    });

  const onPick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setter(await readFile(f));
  };

  const canNext =
    (step === 0 && storeName && ownerName && phone && email) ||
    (step === 1 && area && address && cuisine && description) ||
    step === 2 ||
    step === 3;

  const addItem = () => {
    if (!itemName || !itemPrice) return toast("Add a name and price");
    setMenu((m) => [
      ...m,
      {
        id: "i-" + Math.random().toString(36).slice(2, 7),
        name: itemName,
        price: Number(itemPrice),
        image: itemImage,
      },
    ]);
    setItemName("");
    setItemPrice("");
    setItemImage(undefined);
  };

  const submit = () => {
    if (menu.length === 0) return toast("Add at least one menu item");
    partnerStore.submit({
      storeName,
      ownerName,
      phone,
      email,
      area,
      address,
      cuisine,
      description,
      logo,
      cover,
      menu,
    });
    toast.success("Application submitted!", {
      description: "Aladùn admin will review your store shortly.",
    });
    navigate({ to: "/partner-success" });
  };

  const steps = ["Owner", "Store", "Branding", "Menu"];

  return (
    <PhoneShell showNav={false}>
      <div className="bg-gradient-brand px-6 pt-12 pb-8 text-primary-foreground">
        <button
          onClick={() => (step === 0 ? navigate({ to: "/profile" }) : setStep((step - 1) as Step))}
          className="mb-4 grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-2xl font-extrabold">Partner with Aladùn</h1>
        <p className="text-xs opacity-90">Grow your kitchen. Reach hungry customers.</p>

        <div className="mt-5 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition ${
                  i <= step ? "bg-primary-foreground" : "bg-primary-foreground/25"
                }`}
              />
              <p className="mt-1 text-[10px] font-bold opacity-90">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {step === 0 && (
          <>
            <Field label="Store name" value={storeName} onChange={setStoreName} placeholder="e.g. Mama T Buka" />
            <Field label="Owner full name" value={ownerName} onChange={setOwnerName} placeholder="Your full name" />
            <Field label="Phone number" value={phone} onChange={setPhone} placeholder="+234..." />
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Area / city" value={area} onChange={setArea} placeholder="e.g. Bodija, Ibadan" />
            <Field label="Street address" value={address} onChange={setAddress} placeholder="Full address" />
            <Field label="Cuisine type" value={cuisine} onChange={setCuisine} placeholder="e.g. Yoruba, Grill, Soup" />
            <div>
              <label className="text-xs font-bold text-muted-foreground">About your store</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Tell customers what makes you special"
                className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-xs text-muted-foreground">Upload your logo and a cover image so customers recognise your brand.</p>

            <UploadTile
              label="Store logo"
              hint="Square, min 400×400"
              value={logo}
              onClick={() => logoRef.current?.click()}
            />
            <input ref={logoRef} type="file" accept="image/*" hidden onChange={(e) => onPick(e, setLogo)} />

            <UploadTile
              label="Cover image"
              hint="Wide, min 1200×600"
              value={cover}
              tall
              onClick={() => coverRef.current?.click()}
            />
            <input ref={coverRef} type="file" accept="image/*" hidden onChange={(e) => onPick(e, setCover)} />
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-xs text-muted-foreground">Add the dishes you want to sell on Aladùn.</p>

            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <Field label="Dish name" value={itemName} onChange={setItemName} placeholder="e.g. Party Jollof" />
              <Field label="Price (₦)" value={itemPrice} onChange={setItemPrice} placeholder="3500" type="number" />
              <button
                onClick={() => itemImgRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-xs font-bold text-muted-foreground"
              >
                <ImagePlus className="h-4 w-4" />
                {itemImage ? "Image added · tap to change" : "Add dish photo (optional)"}
              </button>
              <input ref={itemImgRef} type="file" accept="image/*" hidden onChange={(e) => onPick(e, setItemImage)} />
              <button
                onClick={addItem}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> Add to menu
              </button>
            </div>

            {menu.length > 0 && (
              <ul className="space-y-2">
                {menu.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                  >
                    <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-primary-soft text-primary">
                      {m.image ? (
                        <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                      ) : (
                        <Utensils className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{formatNaira(m.price)}</p>
                    </div>
                    <button
                      onClick={() => setMenu((x) => x.filter((i) => i.id !== m.id))}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <div className="sticky bottom-0 mt-4 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        {step < 3 ? (
          <button
            disabled={!canNext}
            onClick={() => setStep((step + 1) as Step)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-brand disabled:opacity-50"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-brand"
          >
            <Check className="h-4 w-4" /> Submit for approval
          </button>
        )}
      </div>
    </PhoneShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function UploadTile({
  label,
  hint,
  value,
  onClick,
  tall,
}: {
  label: string;
  hint: string;
  value?: string;
  onClick: () => void;
  tall?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card text-muted-foreground ${
        tall ? "h-40" : "h-28"
      }`}
    >
      {value ? (
        <>
          <img src={value} alt={label} className="absolute inset-0 h-full w-full object-cover" />
          <span className="relative z-10 rounded-full bg-background/90 px-3 py-1 text-[11px] font-bold text-foreground">
            Change {label.toLowerCase()}
          </span>
        </>
      ) : (
        <>
          <ImagePlus className="h-6 w-6" />
          <span className="text-sm font-bold text-foreground">{label}</span>
          <span className="text-[10px]">{hint}</span>
        </>
      )}
    </button>
  );
}

export function PartnerSuccessPage() {
  return (
    <PhoneShell showNav={false}>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold">Application received</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for partnering with Aladùn. Our admin team will review your store within 24 hours and reach out by email.
        </p>
        <Link
          to="/home"
          className="mt-8 w-full rounded-2xl bg-primary py-4 text-center text-sm font-extrabold text-primary-foreground shadow-brand"
        >
          Back to home
        </Link>
        <Link to="/admin" className="mt-3 text-xs font-bold text-primary">
          View admin dashboard (demo)
        </Link>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Store className="h-3 w-3" /> You'll get an email once approved
        </div>
      </div>
    </PhoneShell>
  );
}
