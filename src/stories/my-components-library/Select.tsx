import { type FunctionComponent, type HTMLProps } from "react";

export interface SelectProps {
  label?: string;
  errorMessage?: string;
  onChange?: HTMLProps<HTMLSelectElement>["onChange"];
  value?: HTMLProps<HTMLSelectElement>["value"];
  required?: HTMLProps<HTMLSelectElement>["required"];
  children?: HTMLProps<HTMLSelectElement>["children"];
  selectProps?: Partial<HTMLProps<HTMLSelectElement>>;
}

export const Select: FunctionComponent<SelectProps> = ({
  label,
  errorMessage,
  onChange,
  value,
  required,
  children,
  selectProps,
}) => (
  <div className="Select" style={{ display: "inline-block" }}>
    <label className="Select-LabelTag">
      {label && (
        <div
          className="Select-Label"
          style={{
            fontSize: "0.75rem",
            fontFamily: "sans-serif",
          }}
        >
          {`${label}${required ? "" : " (optional)"}`}
        </div>
      )}
      <select
        className="Select-Select"
        onChange={onChange}
        value={value}
        required={required}
        {...selectProps}
        style={
          errorMessage
            ? {
                accentColor: "light-dark(darkred, red)",
                ...selectProps?.style,
              }
            : selectProps?.style
        }
      >
        {children}
      </select>
    </label>
    {errorMessage && (
      <div
        className="Input-Error"
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
