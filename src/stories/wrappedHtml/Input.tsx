import { type HTMLProps } from "react";
import {
  usePlainValidation,
  type CustomMessages,
  type CustomValidationFunction,
  type DefaultMessageConverterFunction,
} from "../../hooks/usePlainValidation";
import type { ErrorVisibilityMode } from "../../types";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  defaultMessageConverter?: DefaultMessageConverterFunction;
  customMessages?: CustomMessages;
  customValidation?: CustomValidationFunction;
  errorVisibilityMode?: ErrorVisibilityMode;
  label?: string;
}

export const Input = ({
  defaultMessageConverter,
  customMessages,
  customValidation,
  errorVisibilityMode,
  label,
  ref: inputRef,
  style,
  ...props
}: InputProps) => {
  const { inputRef: ref, validationMessage } = usePlainValidation({
    defaultMessageConverter,
    customMessages,
    customValidation,
    errorVisibilityMode,
    inputRef,
    propsValue: props.value,
  });

  return (
    <div className="Input" style={{ display: "inline-block" }}>
      <label className="Input-LabelTag">
        {label && (
          <div
            className="Input-Label"
            style={{
              fontSize: "0.75rem",
              fontFamily: "sans-serif",
            }}
          >
            {label}
          </div>
        )}
        <input
          className="Input-Input"
          ref={ref}
          {...props}
          style={
            validationMessage
              ? {
                  accentColor: "light-dark(darkred, red)",
                  ...style,
                }
              : style
          }
        />
      </label>
      {validationMessage && (
        <div
          className="Input-Error"
          style={{
            color: "light-dark(darkred, red)",
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
