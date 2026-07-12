/**
 * ONEMISSION brand wordmark (with "Matthew 18:13" line).
 * Rendered in a geometric sans so it scales crisply and inherits the
 * current text color — black on the light header, white on the dark intro.
 */
export function Wordmark({
  size = "md",
  showVerse = true,
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
        ONEMISSION
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
