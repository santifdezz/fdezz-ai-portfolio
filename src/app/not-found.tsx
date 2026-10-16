import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0d0b",
        color: "#ecece7",
        fontFamily: "monospace",
      }}
    >
      <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>404</p>
      <p style={{ color: "#8fa099" }}>Page not found</p>
      <Link href="/" style={{ marginTop: "1rem", color: "#ff5a2e", textDecoration: "none" }}>
        ← Back home
      </Link>
    </div>
  );
}
