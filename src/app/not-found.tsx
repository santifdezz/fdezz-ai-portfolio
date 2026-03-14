export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#050505",
        color: "#e6f7ff",
        fontFamily: "monospace",
      }}
    >
      <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>404</p>
      <p style={{ color: "#888" }}>Page not found</p>
      <a href="/" style={{ marginTop: "1rem", color: "#a78bfa", textDecoration: "none" }}>
        ← Back to terminal
      </a>
    </div>
  );
}
