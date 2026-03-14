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
          background: "#050505",
          color: "#e6f7ff",
          fontFamily: "monospace",
          flexDirection: "column",
          gap: "1rem",
          margin: 0,
        }}
      >
        <p>Something went wrong.</p>
        <button onClick={reset} style={{ cursor: "pointer", color: "#a78bfa" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
