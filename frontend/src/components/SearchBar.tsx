
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
      style={{
        width: "100%",
        maxWidth: 420,
        padding: "10px 12px",
        border: "1px solid #ccc",
        borderRadius: 8,
        fontSize: 16,
      }}
      aria-label="Search stores"
    />
  );
}
