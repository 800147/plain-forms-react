import { type HTMLProps } from "react";
import {
  usePlainValidation,
  type CustomMessages,
  type CustomValidationFunction,
  type DefaultMessageConverterFunction,
  type ErrorVisibilityMode,
} from "../../";
import {
  BrokenSelect,
  type BrokenSelectProps,
} from "../my-components-library/BrokenSelect";
import { ControlWrapper } from "../../components/ControlWrapper/ControlWrapper";

export interface SelectProps extends BrokenSelectProps {
  defaultMessageConverter?: DefaultMessageConverterFunction;
  customMessages?: CustomMessages;
  customValidation?: CustomValidationFunction;
  errorVisibilityMode?: ErrorVisibilityMode;
  disabled?: HTMLProps<HTMLSelectElement>["disabled"];
  form?: HTMLProps<HTMLSelectElement>["form"];
  name?: HTMLProps<HTMLSelectElement>["name"];
}

export const Select = ({
  defaultMessageConverter,
  customMessages,
  customValidation,
  errorVisibilityMode,
  disabled,
  form,
  name,
  errorMessage,
  ...props
}: SelectProps) => {
  const { controlRef: inputRef, validationMessage } = usePlainValidation({
    defaultMessageConverter,
    customMessages,
    customValidation,
    errorVisibilityMode,
    valueProp: props.value,
  });

  return (
    <ControlWrapper
      ref={inputRef}
      required={props.required}
      value={props.value}
      disabled={disabled}
      form={form}
      name={name}
    >
      <BrokenSelect
        errorMessage={errorMessage || validationMessage}
        {...props}
      />
    </ControlWrapper>
  );
};
