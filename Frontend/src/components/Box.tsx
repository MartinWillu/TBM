
import "./Styles/BoxStyle.css";

export interface InputBoxProps {
  type: string;
  placeholder: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

function UsernameBox({ type, placeholder, onChange }: InputBoxProps) {

  return (
    <div className="input-box">
      <input type={type} placeholder={placeholder} onChange={(event) => onChange(event)} />
    </div>
  );
}

export default UsernameBox;