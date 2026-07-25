// "Vanakkam Sapiens!" heading matching the uploaded reference:
// - "VANAKKAM" arched, thin tracked
// - "SAPIENS!" heavy display, punchy green
export function HeroHeading() {
  return (
    <div className="relative flex flex-col items-center">
      <h2
        className="mb-1 text-[22px] sm:text-[30px] md:text-[36px] leading-none"
        style={{
          color: "#22c55e",
          fontFamily: "Josefin Sans, Inter, sans-serif",
          fontWeight: 300,
          letterSpacing: "0.55em",
          paddingLeft: "0.55em",
          textShadow: "0 0 24px rgba(34,197,94,0.25)",
        }}
      >
        VANAKKAM
      </h2>
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