import { type HTMLProps } from "react";
import {
  usePlainValidation,
  type CustomMessages,
} from "../hooks/usePlainValidation";
import type { ErrorVisibilityMode } from "../types";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  customMessages?: CustomMessages;
  errorVisibilityMode?: ErrorVisibilityMode;
}

export const Input = ({
  customMessages,
  errorVisibilityMode,
  ref: inputRef,
  style,
  ...props
}: InputProps) => {
  const { inputRef: ref, validationMessage } = usePlainValidation({
    customMessages,
    errorVisibilityMode,
    inputRef,
  });

  return (
    <div style={{ display: "inline-block" }}>
      <input
        ref={ref}
        {...props}
        style={
          validationMessage
            ? {
                outline: "1px solid red",
                outlineOffset: "-1px",
                ...style,
              }
            : style
        }
      />
      {validationMessage && (
        <div
          className="error-message"
          style={{
            color: "red",
            fontSize: "0.75rem",
            fontFamily: "sans-serif",
          }}
        >
          {validationMessage}
        </div>
      )}
    </div>
  );
};
