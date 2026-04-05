export const metadata = {
  title: "Pricing — ClipGenius",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$5/mo",
      desc: "Perfect for new creators",
      perks: ["30 credits / month", "Fast clipping", "Standard support", "Watermark ON"],
      cta: "Subscribe (tomorrow)",
      badge: "Best value",
    },
    {
      name: "Pro",
      price: "$15/mo",
      desc: "For serious growth",
      perks: ["150 credits / month", "Faster processing", "Priority support", "No watermark"],
      cta: "Subscribe (tomorrow)",
      badge: "Most popular",
    },
    {
      name: "Ultra",
      price: "$39/mo",
      desc: "For teams & agencies",
      perks: ["600 credits / month", "Highest limits", "Priority queue", "No watermark"],
      cta: "Subscribe (tomorrow)",
      badge: "Max power",
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 28 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 42, marginBottom: 6 }}>Pricing</h1>
        <p style={{ color: "rgba(255,255,255,0.65)", margin: 0 }}>
          Start small. Upgrade when you’re ready. Cancel anytime.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {plans.map((p) => (
          <div
            key={p.name}
            style={{
              borderRadius: 22,
              padding: 18,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.35)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{p.name}</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{p.desc}</div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  height: "fit-content",
                }}
              >
                {p.badge}
              </div>
            </div>

            <div style={{ marginTop: 14, fontWeight: 900, fontSize: 30 }}>{p.price}</div>

            <ul style={{ marginTop: 12, color: "rgba(255,255,255,0.75)", paddingLeft: 18 }}>
              {p.perks.map((x) => (
                <li key={x} style={{ marginBottom: 6 }}>
                  {x}
                </li>
              ))}
            </ul>

            <button
              disabled
              style={{
                width: "100%",
                marginTop: 14,
                padding: "12px 14px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 900,
                cursor: "not-allowed",
              }}
            >
              {p.cta}
            </button>

            <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
              Stripe checkout is being added next.
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22, textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
        <a href="/" style={{ textDecoration: "underline" }}>Back to app</a>
      </div>
    </div>
  );
}