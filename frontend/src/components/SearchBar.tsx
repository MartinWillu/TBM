
type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder = "Search stores..." }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search stores"
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "10px 12px",
        fontSize: "1rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--input-bg)",
        color: "var(--text-color)",
        outline: "none"
      }}
      onFocus={(e) => e.target.style.borderColor = "var(--primary-color)"}
      onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
    />
  );
}
