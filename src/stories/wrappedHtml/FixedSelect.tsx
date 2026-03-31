import { type HTMLProps } from "react";
import {
  usePlainValidation,
  type CustomMessages,
  type CustomValidationFunction,
} from "../../hooks/usePlainValidation";
import type { ErrorVisibilityMode } from "../../types";
import { BrokenSelect } from "./BrokenSelect";
import { ControlWrapper } from "../../components/ControlWrapper/ControlWrapper";

export interface FixedSelectProps extends HTMLProps<HTMLSelectElement> {
  customMessages?: CustomMessages;
  customValidation?: CustomValidationFunction;
  errorVisibilityMode?: ErrorVisibilityMode;
  label?: string;
}

export const FixedSelect = ({
  customMessages,
  customValidation,
  errorVisibilityMode,
  label,
  ref: inputRef,
  ...props
}: FixedSelectProps) => {
  const { inputRef: ref, validationMessage } = usePlainValidation({
    customMessages,
    customValidation,
    errorVisibilityMode,
    inputRef,
    propsValue: String(props.value),
  });

  return (
    <ControlWrapper
      ref={ref}
      required={props.required}
      value={props.value}
      defaultValue={props.defaultValue}
    >
      <BrokenSelect label={label} error={validationMessage} {...props} />
    </ControlWrapper>
  );
};
