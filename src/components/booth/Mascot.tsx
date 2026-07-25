import mascotAsset from "/assets/mascot.png";

// Mascot sits inside a glass "sticker" so the source PNG's white background
// reads as intentional, not a compositing bug.
export function Mascot({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute -inset-4 rounded-[36%] blur-2xl"
        style={{ background: "rgba(34,197,94,0.35)" }}
      />
      <div
        className="cs-mascot-idle relative flex h-full w-full items-end justify-center overflow-hidden rounded-[32%] border border-emerald-400/40 bg-white p-4"
        style={{
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.6), 0 0 30px rgba(34,197,94,0.35)",
        }}
      >
        <img
          src={mascotAsset}
          alt="Code Sapiens mascot"
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}