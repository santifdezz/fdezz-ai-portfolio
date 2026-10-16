"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0d0b",
          color: "#ecece7",
          fontFamily: "monospace",
          flexDirection: "column",
          gap: "1rem",
          margin: 0,
        }}
      >
        <p>Something went wrong.</p>
        <button onClick={reset} style={{ cursor: "pointer", color: "#ff5a2e" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
