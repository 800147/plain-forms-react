import { type FunctionComponent, type HTMLProps } from "react";

export interface TextFieldProps {
  label?: string;
  errorMessage?: string;
  onChange?: HTMLProps<HTMLInputElement>["onChange"];
  value?: HTMLProps<HTMLInputElement>["value"];
  placeholder?: HTMLProps<HTMLInputElement>["placeholder"];
  required?: HTMLProps<HTMLInputElement>["required"];
  inputProps?: Partial<HTMLProps<HTMLInputElement>>;
}

export const TextField: FunctionComponent<TextFieldProps> = ({
  label,
  errorMessage,
  onChange,
  value,
  placeholder,
  required,
  inputProps,
}) => (
  <div className="TextField" style={{ display: "inline-block" }}>
    <label className="TextField-LabelTag">
      {label && (
        <div
          className="TextField-Label"
          style={{
            fontSize: "0.75rem",
            fontFamily: "sans-serif",
          }}
        >
          {`${label}${required ? "" : " (optional)"}`}
        </div>
      )}
      <input
        className="TextField-Input"
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        required={required}
        {...inputProps}
        style={
          errorMessage
            ? {
                accentColor: "light-dark(darkred, red)",
                ...inputProps?.style,
              }
            : inputProps?.style
        }
      />
    </label>
    {errorMessage && (
      <div
        className="TextField-Error"
        style={{
          color: "light-dark(darkred, red)",
          fontSize: "0.75rem",
          fontFamily: "sans-serif",
        }}
      >
        {errorMessage}
      </div>
    )}
  </div>
);
