export const metadata = {
  title: "Terms of Service — ClipGenius",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 18px", color: "white" }}>
      <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 6 }}>Terms of Service</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div style={{ lineHeight: 1.7, fontSize: 15, opacity: 0.92 }}>
        <h2 style={H2}>1) About ClipGenius</h2>
        <p>
          ClipGenius (“we”, “us”, “our”) is a tool that helps users create short video clips, captions, and edits from content
          they provide. By using ClipGenius, you agree to these Terms of Service (“Terms”).
        </p>

        <h2 style={H2}>2) Eligibility</h2>
        <p>
          You must be allowed to use this service under your local laws. If you are under the legal age in your country,
          you must have permission from a parent/guardian to use ClipGenius.
        </p>

        <h2 style={H2}>3) Your Content & Ownership</h2>
        <p>
          You keep ownership of any content you upload, submit, or process (“User Content”). We do not claim ownership of your content.
        </p>

        <h2 style={H2}>4) You Must Have Rights</h2>
        <p>
          You may only upload or process content that you own or have legal permission to use. This includes videos, music,
          images, and streams.
        </p>
        <p>
          <b>You are responsible for your uploads.</b> If you upload content you do not have rights to, you may be violating copyright,
          platform rules, or laws.
        </p>

        <h2 style={H2}>5) Copyright / DMCA / Takedown Requests</h2>
        <p>
          We respect copyright owners. If you believe your copyrighted work was processed or shared using ClipGenius in a way
          that violates your rights, you may contact us with a takedown request.
        </p>
        <p>
          We may remove access to content, block accounts, or cooperate with valid legal requests.
        </p>

        <h2 style={H2}>6) Prohibited Use</h2>
        <p>You agree NOT to use ClipGenius to:</p>
        <ul style={UL}>
          <li>Upload content you don’t own or don’t have permission to use</li>
          <li>Break laws, platform rules, or copyright rules</li>
          <li>Harass, impersonate, or target individuals</li>
          <li>Generate illegal, harmful, or abusive content</li>
          <li>Attempt to hack, exploit, or overload the service</li>
        </ul>

        <h2 style={H2}>7) AI Processing & Output</h2>
        <p>
          ClipGenius may use AI models to generate subtitles, transcriptions, titles, and editing decisions.
          AI output can be incorrect, incomplete, or inappropriate.
        </p>
        <p>
          <b>You must review all outputs before posting.</b> You are responsible for how you publish or use the results.
        </p>

        <h2 style={H2}>8) Storage & Auto-Deletion</h2>
        <p>
          We may temporarily store uploaded videos, generated clips, and captions to provide the service.
        </p>
        <p>
          <b>Files may be automatically deleted after approximately 72 hours</b> (or sooner) for performance and cost reasons.
          We do not guarantee permanent storage.
        </p>

        <h2 style={H2}>9) Account & Access</h2>
        <p>
          You are responsible for keeping your account secure. We may suspend or terminate accounts that violate these Terms
          or create risk for the platform.
        </p>

        <h2 style={H2}>10) Payments & Credits (if enabled)</h2>
        <p>
          ClipGenius may offer paid plans or credits. If you purchase a plan, you agree to pay the listed price and understand
          that usage costs may depend on video length and AI processing.
        </p>
        <p>
          Unless required by law, payments are non-refundable once processing has started.
        </p>

        <h2 style={H2}>11) No Guarantees</h2>
        <p>
          ClipGenius is provided “as-is” and “as available.” We do not guarantee that the service will be uninterrupted or error-free.
        </p>

        <h2 style={H2}>12) Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, ClipGenius will not be liable for lost profits, lost data, business interruption,
          or any indirect or consequential damages arising from your use of the service.
        </p>

        <h2 style={H2}>13) Changes to These Terms</h2>
        <p>
          We may update these Terms at any time. If we do, we may change the “Last updated” date above. Continued use means
          you accept the updated Terms.
        </p>

        <h2 style={H2}>14) Contact</h2>
        <p>
          If you have questions or legal requests, contact us at:{" "}
          <b>support@clipgenius.app</b>
        </p>

        <hr style={{ borderColor: "rgba(255,255,255,0.15)", margin: "24px 0" }} />

        <p style={{ fontSize: 13, opacity: 0.7 }}>
          clip genius
        </p>
      </div>
    </main>
  );
}

const H2 = {
  fontSize: 18,
  fontWeight: 900,
  marginTop: 20,
  marginBottom: 8,
};

const UL = {
  paddingLeft: 18,
  marginTop: 6,
  marginBottom: 6,
  opacity: 0.95,
};