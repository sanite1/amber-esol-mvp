// src/modules/platform/components/SafariTintBars.tsx

export default function SafariTintBars({
  color = "#ffffff",
}: {
  color?: string;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "auto",
          backgroundColor: color,
          pointerEvents: "none",
          zIndex: 99999,
          // This is the key trick — makes it invisible to the user
          // but Safari still reads the background-color for tinting
          maskImage: "linear-gradient(to right, transparent, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, transparent)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "auto",
          backgroundColor: color,
          pointerEvents: "none",
          zIndex: 99999,
          maskImage: "linear-gradient(to right, transparent, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, transparent)",
        }}
      />
    </>
  );
}
