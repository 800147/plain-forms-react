import type { HTMLProps } from "react";
import {
  TextField as UiTextField,
  type TextFieldProps as UiTextFieldProps,
} from "my-components-library";
import {
  usePlainValidation,
  type CustomMessages,
  type CustomValidationFunction,
  type DefaultMessageConverterFunction,
  type ErrorVisibilityMode,
} from "plain-forms-react";

export interface TextFieldProps extends UiTextFieldProps {
  defaultMessageConverter?: DefaultMessageConverterFunction;
  customMessages?: CustomMessages;
  customValidation?: CustomValidationFunction;
  errorVisibilityMode?: ErrorVisibilityMode;
  disabled?: HTMLProps<HTMLInputElement>["disabled"];
  form?: HTMLProps<HTMLInputElement>["form"];
  name?: HTMLProps<HTMLInputElement>["name"];
  inputMode?: HTMLProps<HTMLInputElement>["inputMode"];
  max?: HTMLProps<HTMLInputElement>["max"];
  maxLength?: HTMLProps<HTMLInputElement>["maxLength"];
  min?: HTMLProps<HTMLInputElement>["min"];
  minLength?: HTMLProps<HTMLInputElement>["minLength"];
  pattern?: HTMLProps<HTMLInputElement>["pattern"];
  size?: HTMLProps<HTMLInputElement>["size"];
  step?: HTMLProps<HTMLInputElement>["step"];
  type?: HTMLProps<HTMLInputElement>["type"];
}

export const TextField = ({
  defaultMessageConverter,
  customMessages,
  customValidation,
  errorVisibilityMode,
  disabled,
  form,
  name,
  inputMode,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  size,
  step,
  type,
  inputProps,
  errorMessage,
  ...props
}: TextFieldProps) => {
  const { controlRef, validationMessage } = usePlainValidation({
    defaultMessageConverter,
    customMessages,
    customValidation,
    errorVisibilityMode,
    controlRefProp: inputProps?.ref,
    valueProp: props.value,
  });

  return (
    <UiTextField
      errorMessage={errorMessage || validationMessage}
      inputProps={{
        ...inputProps,
        ref: controlRef,
        disabled,
        form,
        name,
        inputMode,
        max,
        maxLength,
        min,
        minLength,
        pattern,
        size,
        step,
        type,
      }}
      {...props}
    />
  );
};
