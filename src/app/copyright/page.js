export const metadata = {
  title: "Copyright — ClipGenius",
};

export default function CopyrightPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Copyright Notice</h1>
      <p><b>Last updated:</b> {new Date().toLocaleDateString()}</p>

      <p>
        ClipGenius is a tool for video clipping. Users must upload only content they own or have permission to use.
      </p>

      <p>
        For copyright concerns, contact: <b>dmca@clipgenius.ai</b>
      </p>
    </div>
  );
}