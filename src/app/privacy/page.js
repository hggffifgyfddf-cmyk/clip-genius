export const metadata = {
  title: "Privacy Policy — ClipGenius",
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Privacy Policy</h1>
      <p><b>Last updated:</b> {new Date().toLocaleDateString()}</p>

      <h2>1) Data we process</h2>
      <p>
        We process basic account info for login (handled by Clerk) and job information needed to
        generate clips (settings + file paths).
      </p>

      <h2>2) Uploaded files</h2>
      <p>
        Videos uploaded are used only for processing. Files may be deleted after 72 hours.
      </p>

      <h2>3) Payments</h2>
      <p>
        If payments are enabled, payments are processed by Stripe. We do not store full payment card details.
      </p>

      <h2>4) Contact</h2>
      <p>
        Contact: <b>privacy@clipgenius.ai</b>
      </p>
    </div>
  );
}