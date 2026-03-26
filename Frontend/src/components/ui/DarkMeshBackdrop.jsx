/** Shared diagonal diamond grid + vignette (hero, footer, etc.). */

const GRID_STYLE = {
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 11px,
      rgba(255, 255, 255, 0.07) 11px,
      rgba(255, 255, 255, 0.07) 12px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent 0px,
      transparent 11px,
      rgba(255, 255, 255, 0.07) 11px,
      rgba(255, 255, 255, 0.07) 12px
    )
  `,
  maskImage:
    "radial-gradient(ellipse 78% 72% at 50% 44%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.22) 52%, rgba(255,255,255,0) 74%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 78% 72% at 50% 44%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.22) 52%, rgba(255,255,255,0) 74%)",
};

/**
 * @param {{ glow?: "bottom" | "top" }} props — where to place the soft orange wash
 */
export default function DarkMeshBackdrop({ glow = "bottom" }) {
  const glowClass =
    glow === "top"
      ? "pointer-events-none absolute -top-[20%] left-1/2 h-[min(420px,55vw)] w-[min(520px,90vw)] -translate-x-1/2 rounded-full bg-[#fc8019]/[0.07] blur-3xl"
      : "pointer-events-none absolute -bottom-[20%] left-1/2 h-[min(420px,55vw)] w-[min(520px,90vw)] -translate-x-1/2 rounded-full bg-[#fc8019]/[0.07] blur-3xl";

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_38%,rgba(30,40,58,0.55)_0%,#030508_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.88]"
        style={GRID_STYLE}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_50%,transparent_35%,#000_100%)] opacity-55"
        aria-hidden
      />
      <div className={glowClass} aria-hidden />
    </>
  );
}
