// "Vanakkam Sapiens!" heading matching the uploaded reference:
// - "VANAKKAM" arched, thin tracked
// - "SAPIENS!" heavy display, punchy green
export function HeroHeading() {
  return (
    <div className="relative flex flex-col items-center">
      <h2
        className="text-[20px] sm:text-[28px] md:text-[34px]"
        style={{
          color: "#22c55e",
          fontFamily: "Josefin Sans, Inter, sans-serif",
          fontWeight: 300,
          letterSpacing: "0.45em",
          textIndent: "0.45em",
        }}
      >
        VANAKKAM
      </h2>
    </div>
  );
}