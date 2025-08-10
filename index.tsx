
import React, { useMemo, useState } from "react";

// --- Configurable pricing --- //
const PRICING = {
  Household: { quarter: 80, half: 150, threeQuarter: 220, full: 300 },
  Garden: { quarter: 90, half: 160, threeQuarter: 230, full: 320 },
  Construction: { quarter: 100, half: 180, threeQuarter: 250, full: 350 },
};

const EXTRAS = [
  { key: "fridge", label: "Fridge/Freezer", price: 25 },
  { key: "mattress", label: "Mattress", price: 15 },
  { key: "paint", label: "Paint tins (up to 5)", price: 20 },
  { key: "tv", label: "TV/Monitor", price: 10 },
];

function travelFeeForPostcode(pc: string) {
  const p = (pc || "").trim().toUpperCase();
  if (!p) return 0;
  if (p.startsWith("PO")) return 0;
  if (p.startsWith("SO") || p.startsWith("GU")) return 10;
  return 15;
}

function currency(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

export default function Home() {
  const [businessName, setBusinessName] = useState("FastClear Portsmouth");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("PO1 1AA");
  const [address, setAddress] = useState("");
  const [wasteType, setWasteType] = useState<keyof typeof PRICING | "">("");
  const [loadSize, setLoadSize] = useState<"quarter" | "half" | "threeQuarter" | "full" | "">("");
  const [notes, setNotes] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [extras, setExtras] = useState<Record<string, boolean>>({});
  const [agree, setAgree] = useState(false);

  const basePrice = useMemo(() => {
    if (!wasteType || !loadSize) return 0;
    return PRICING[wasteType as keyof typeof PRICING][loadSize as "quarter"|"half"|"threeQuarter"|"full"];
  }, [wasteType, loadSize]);

  const extrasTotal = useMemo(() => {
    return EXTRAS.reduce((sum, x) => (extras[x.key] ? sum + x.price : sum), 0);
  }, [extras]);

  const travelFee = useMemo(() => travelFeeForPostcode(postcode), [postcode]);
  const estimatedTotal = basePrice + extrasTotal + travelFee;

  function toggleExtra(key: string) {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function copySummary() {
    const summary = `Quote for ${businessName}

Customer: ${customerName}
Contact: ${phone} | ${email}
Address: ${address}
Postcode: ${postcode}

Waste type: ${wasteType || "-"}
Load size: ${loadSize || "-"}
Extras: ${EXTRAS.filter(x => extras[x.key]).map(x => x.label).join(", ") || "None"}
Travel fee: ${currency(travelFee)}

Estimated total: ${currency(estimatedTotal)}
Preferred date/time: ${dateTime || "-"}

Notes: ${notes || "-"}
`;
    navigator.clipboard.writeText(summary);
    alert("Quote copied to clipboard");
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    // If you have a Formspree endpoint, paste it here:
    const FORMSPREE_ENDPOINT = ""; // e.g., "https://formspree.io/f/xxxxxx"

    const payload = {
      business: businessName,
      customerName, phone, email, postcode, address,
      wasteType, loadSize, extras: Object.keys(extras).filter(k => extras[k]),
      travelFee, estimatedTotal, dateTime, notes
    };

    if (!FORMSPREE_ENDPOINT) {
      console.log("Booking payload:", payload);
      alert("Demo: booking captured in console. Add a Formspree endpoint to send emails.");
      return;
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) alert("Booking request sent! We will contact you shortly.");
      else alert("There was an error submitting the booking. Please try WhatsApp or call.");
    } catch (err) {
      alert("Network error. Please try again later.");
    }
  }

  const readyToBook = customerName && phone && postcode && wasteType && loadSize && dateTime && agree;

  return (
    <main style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{businessName}</h1>
            <p style={{ margin: "4px 0 0 0", color: "#475569" }}>Same‑day rubbish clearance & recycling</p>
            <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
              <a href="tel:07904127054" style={{ textDecoration: "none", padding: "6px 10px", borderRadius: 8, border: "1px solid #16a34a" }}>📞 07904 127 054</a>
              <a href="https://wa.me/447904127054" target="_blank" rel="noreferrer" style={{ textDecoration: "none", padding: "6px 10px", borderRadius: 8, border: "1px solid #22c55e" }}>💬 WhatsApp</a>
              <a href="https://fastclearportsmouth.co.uk" target="_blank" rel="noreferrer" style={{ textDecoration: "none", padding: "6px 10px", borderRadius: 8, border: "1px solid #3b82f6" }}>🌐 Website</a>
            </div>
          </div>
        </header>

        <form onSubmit={submitBooking} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <section style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12, background: "white" }}>
            <h2 style={{ marginTop: 0 }}>Get your quote</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>Customer name<input required value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="John Smith" style={{ display:"block", width:"100%" }} /></label>
              <label>Phone<input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07…" style={{ display:"block", width:"100%" }} /></label>
              <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@email.com" style={{ display:"block", width:"100%" }} /></label>
              <label>Postcode<input required value={postcode} onChange={e=>setPostcode(e.target.value)} placeholder="PO1 1AA" style={{ display:"block", width:"100%" }} /></label>
              <label style={{ gridColumn: "1 / -1" }}>Address<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="House/Flat number, street" style={{ display:"block", width:"100%" }} /></label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
              <label>Waste type
                <select required value={wasteType} onChange={e=>setWasteType(e.target.value as any)} style={{ display:"block", width:"100%" }}>
                  <option value="">Select</option>
                  {Object.keys(PRICING).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </label>
              <label>Load size
                <select required value={loadSize} onChange={e=>setLoadSize(e.target.value as any)} style={{ display:"block", width:"100%" }}>
                  <option value="">Select</option>
                  <option value="quarter">¼ load (≈3.5 yd³)</option>
                  <option value="half">½ load (≈7 yd³)</option>
                  <option value="threeQuarter">¾ load (≈10 yd³)</option>
                  <option value="full">Full load (≈14 yd³)</option>
                </select>
              </label>
              <label>Preferred date & time
                <input type="datetime-local" required value={dateTime} onChange={e=>setDateTime(e.target.value)} style={{ display:"block", width:"100%" }} />
              </label>
            </div>

            <div style={{ marginTop: 12 }}>
              <p style={{ margin: "0 0 6px 0" }}>Extras</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                {EXTRAS.map(x => (
                  <label key={x.key} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 8 }}>
                    <input type="checkbox" checked={!!extras[x.key]} onChange={()=>toggleExtra(x.key)} />{" "}
                    {x.label} <span style={{ color: "#64748b" }}>({currency(x.price)})</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Notes
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Access info, parking, special items…" style={{ display:"block", width:"100%", minHeight: 80 }} />
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <input type="checkbox" checked={agree} onChange={()=>setAgree(!agree)} />
              <span>I confirm the details are correct. Final price may change after on‑site assessment.</span>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={copySummary}>Copy quote</button>
              <button type="submit" disabled={!readyToBook} style={{ padding: "8px 12px" }}>
                {readyToBook ? "Confirm & request booking" : "Complete required fields"}
              </button>
            </div>
          </section>

          <aside style={{ display: "grid", gap: 16 }}>
            <section style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12, background: "white" }}>
              <h3 style={{ marginTop: 0 }}>Estimate</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, fontSize: 14 }}>
                <span>Base price</span><span>{basePrice ? currency(basePrice) : "—"}</span>
                <span>Extras</span><span>{currency(extrasTotal)}</span>
                <span>Travel fee</span><span>{currency(travelFee)}</span>
                <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #e2e8f0", marginTop: 6 }} />
                <strong>Total</strong><strong>{currency(estimatedTotal)}</strong>
              </div>
            </section>

            <section style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12, background: "white" }}>
              <h3 style={{ marginTop: 0 }}>Availability (demo)</h3>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Mon–Sat: 08:00–18:00</li>
                <li>Same‑day bookings subject to confirmation</li>
                <li>Bank holidays: limited service</li>
              </ul>
            </section>
          </aside>
        </form>

        <footer style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "#64748b" }}>
          © {new Date().getFullYear()} {businessName}. Waste carrier licensed. Prices include labour & disposal. Final quote confirmed on site.
        </footer>
      </div>
    </main>
  );
}
