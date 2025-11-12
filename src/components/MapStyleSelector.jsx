import { MAPTILER_STYLES } from "./mapTilerStyles.js";

export default function MapStyleSelector({
  selectedStyle,
  onChange,
  disabled,
}) {
  return (
    <select
      value={selectedStyle}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 10,
        padding: "7px 12px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        background: "#fff",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {MAPTILER_STYLES.map((style) => (
        <option key={style.value} value={style.value}>
          {style.label}
        </option>
      ))}
    </select>
  );
}
