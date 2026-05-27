// labeled multi-line textarea

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: Props) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
