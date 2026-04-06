import { type HTMLProps } from "react";
import {
  BrokenSelect as UiBrokenSelect,
  type BrokenSelectProps as UiBrokenSelectProps,
} from "my-components-library";
import {
  usePlainValidation,
  ControlWrapper,
  type CustomMessages,
  type CustomValidationFunction,
  type DefaultMessageConverterFunction,
  type ErrorVisibilityMode,
} from "plain-forms-react";

export interface BrokenSelectProps extends UiBrokenSelectProps {
  defaultMessageConverter?: DefaultMessageConverterFunction;
  customMessages?: CustomMessages;
  customValidation?: CustomValidationFunction;
  errorVisibilityMode?: ErrorVisibilityMode;
  disabled?: HTMLProps<HTMLSelectElement>["disabled"];
  form?: HTMLProps<HTMLSelectElement>["form"];
  name?: HTMLProps<HTMLSelectElement>["name"];
}

export const BrokenSelect = ({
  defaultMessageConverter,
  customMessages,
  customValidation,
  errorVisibilityMode,
  disabled,
  form,
  name,
  errorMessage,
  ...props
}: BrokenSelectProps) => {
  const { controlRef, validationMessage } = usePlainValidation({
    defaultMessageConverter,
    customMessages,
    customValidation,
    errorVisibilityMode,
    valueProp: props.value,
  });

  return (
    <ControlWrapper
      ref={controlRef}
      required={props.required}
      value={props.value}
      disabled={disabled}
      form={form}
      name={name}
    >
      <UiBrokenSelect
        errorMessage={errorMessage || validationMessage}
        {...props}
      />
    </ControlWrapper>
  );
};
