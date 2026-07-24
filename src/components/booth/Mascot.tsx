import mascotAsset from "@/assets/mascot.png.asset.json";

export function Mascot({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-x-4 -bottom-4 h-6 rounded-full blur-xl"
        style={{ background: "rgba(34,197,94,0.45)" }}
      />
      <img
        src={mascotAsset.url}
        alt="Code Sapiens mascot"
        className="cs-mascot-idle relative h-full w-full object-contain"
        style={{
          filter:
            "invert(1) drop-shadow(0 0 24px rgba(34,197,94,0.45))",
        }}
        draggable={false}
      />
    </div>
  );
}