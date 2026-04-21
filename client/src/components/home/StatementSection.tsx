export default function StatementSection() {
  return (
    <section
      className="flex items-center justify-center px-6 py-28 sm:py-36 lg:py-44"
      style={{ backgroundColor: "var(--surface-sunken)" }}
      aria-label="Brand statement"
    >
      <h2
        className="text-center font-extrabold tracking-tight max-w-4xl mx-auto"
        style={{
          fontSize: "clamp(1.75rem, 6vw, 4.5rem)",
          lineHeight: "1.08",
          color: "var(--foreground)",
        }}
      >
        You didn't start a business
        <br className="hidden sm:inline" />
        {" "}to become its{" "}
        <span style={{ color: "var(--amber)" }}>employee.</span>
      </h2>
    </section>
  );
}
