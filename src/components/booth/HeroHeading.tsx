// "Vanakkam Sapiens!" heading matching the uploaded reference:
// - "VANAKKAM" arched, thin tracked
// - "SAPIENS!" heavy display, punchy green
export function HeroHeading() {
  return (
    <div className="relative flex flex-col items-center">
      <ArchedVanakkam />
      <h1
        className="font-display text-[36px] leading-none tracking-tight sm:text-[56px] md:text-[72px]"
        style={{
          color: "#22c55e",
          textShadow:
            "0 4px 0 rgba(0,0,0,0.35), 0 0 40px rgba(34,197,94,0.35)",
        }}
      >
        SAPIENS<span style={{ color: "#4ade80" }}>!</span>
      </h1>
    </div>
  );
}

function ArchedVanakkam() {
  return (
    <svg
      viewBox="0 0 600 180"
      className="mb-1 w-[180px] sm:w-[260px] md:w-[320px]"
      aria-label="Vanakkam"
    >
      <defs>
        <path id="cs-arch" d="M 40 160 Q 300 -30 560 160" fill="none" />
      </defs>
      <text
        fill="#22c55e"
        style={{
          fontFamily: "Josefin Sans, Inter, sans-serif",
          fontWeight: 300,
          fontSize: 54,
          letterSpacing: "0.55em",
        }}
      >
        <textPath href="#cs-arch" startOffset="50%" textAnchor="middle">
          VANAKKAM
        </textPath>
      </text>
    </svg>
  );
}