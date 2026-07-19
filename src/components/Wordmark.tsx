/**
 * ONE MISSION brand wordmark.
 * Rendered in a geometric sans so it scales crisply and inherits the
 * current text color — black on the light header, white on the dark intro.
 *
 * The verse lockup is off by default; Matthew 18:13 lives on the mission
 * section of the homepage rather than in the header logo.
 */
export function Wordmark({
  size = "md",
  showVerse = false,
  className = "",
}: {
  size?: "md" | "lg";
  showVerse?: boolean;
  className?: string;
}) {
  const main =
    size === "lg"
      ? "text-2xl sm:text-3xl"
      : "text-[15px] leading-none sm:text-[17px]";
  const verse =
    size === "lg"
      ? "text-[9px] sm:text-[10px]"
      : "text-[7px] sm:text-[8px]";

  return (
    <span
      className={`inline-flex flex-col items-center leading-none text-current ${className}`}
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      <span className={`${main} font-semibold`} style={{ letterSpacing: "0.1em" }}>
        ONE MISSION
      </span>
      {showVerse && (
        <span
          className={`${verse} mt-1 font-medium opacity-90`}
          style={{ letterSpacing: "0.4em" }}
        >
          MATTHEW 18:13
        </span>
      )}
    </span>
  );
}
