import { type HTMLProps } from "react";

export interface BrokenSelectProps extends HTMLProps<HTMLSelectElement> {
  error?: string;
  label?: string;
}

export const BrokenSelect = ({
  error,
  label,
  style,
  ...props
}: BrokenSelectProps) => {
  return (
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
            {label}
          </div>
        )}
        <select
          className="Select-Select"
          {...props}
          style={
            error
              ? {
                  accentColor: "light-dark(darkred, red)",
                  ...style,
                }
              : style
          }
          // Breaking the Select
          form="non-existent-form"
        />
      </label>
      {error && (
        <div
          className="Input-Error"
          style={{
            color: "light-dark(darkred, red)",
            fontSize: "0.75rem",
            fontFamily: "sans-serif",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
