// labeled single-line text input

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TextField({ label, value, onChange, placeholder }: Props) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
