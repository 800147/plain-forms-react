import {
  type AllHTMLAttributes,
  type Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ErrorVisibilityMode } from "../types";

export type FormControl =
  | HTMLTextAreaElement
  | HTMLInputElement
  | HTMLSelectElement;
export type Invalidity = Exclude<keyof ValidityState, "valid">;
export type CustomMessages = Partial<
  Record<Invalidity, string | ((input: FormControl) => string)>
>;

export type CustomValidationFunction = (
  value: string,
  input: FormControl,
) => string | undefined;

export type DefaultMessageConverterFunction = (message: string) => string;

const noConverter: DefaultMessageConverterFunction = (message) => message;

const getValidationMessage = (
  input: FormControl,
  customMessages?: CustomMessages,
  customValidation?: CustomValidationFunction,
  defaultMessageConverter: DefaultMessageConverterFunction = noConverter,
) => {
  const order: Invalidity[] = [
    "customError",
    "valueMissing",
    "typeMismatch",
    "patternMismatch",
    "tooLong",
    "tooShort",
    "rangeOverflow",
    "rangeUnderflow",
    "stepMismatch",
    "badInput",
  ];

  const customValidationResult = customValidation?.(input.value, input);

  if (customValidationResult) {
    return customValidationResult;
  }

  for (let i = 0; i < order.length; i += 1) {
    const key = order[i];

    if (input.validity[key]) {
      const customMessage = customMessages?.[key];

      switch (typeof customMessage) {
        case "string":
          return customMessage;
        case "function":
          return customMessage(input);
        default:
          return (
            input.validationMessage &&
            defaultMessageConverter(input.validationMessage)
          );
      }
    }
  }

  return (
    input.validationMessage && defaultMessageConverter(input.validationMessage)
  );
};

const getErrorVisibilityMode = (
  input: FormControl,
  errorVisibilityModeProp?: ErrorVisibilityMode,
): ErrorVisibilityMode => {
  if (errorVisibilityModeProp) {
    return errorVisibilityModeProp;
  }

  return (
    (input.form?.dataset?.errorVisibilityMode as
      | ErrorVisibilityMode
      | undefined) ?? "afterSubmit"
  );
};

type usePlainValidationType = (props?: {
  defaultMessageConverter?: DefaultMessageConverterFunction;
  customMessages?: CustomMessages;
  customValidation?: CustomValidationFunction;
  errorVisibilityMode?: ErrorVisibilityMode;
  inputRef?: Ref<FormControl | null>;
  /** For controlled components */
  propsValue?: AllHTMLAttributes<HTMLInputElement>["value"];
}) => {
  inputRef: (el: FormControl | null) => void;
  validationMessage?: string;
};

export const usePlainValidation: usePlainValidationType = ({
  customMessages,
  customValidation,
  errorVisibilityMode: errorVisibilityModeProp,
  inputRef: inputRefProp,
  propsValue,
  defaultMessageConverter,
} = {}) => {
  const [validationMessage, setValidationMessage] = useState<string>();
  const [input, setInput] = useState<FormControl | null>(null);
  const form = input?.form;
  const isControlled = propsValue !== undefined;
  const changedRef = useRef(false);
  const customMessagesRef = useRef(customMessages);
  customMessagesRef.current = customMessages;
  const customValidationRef = useRef(customValidation);
  customValidationRef.current = customValidation;
  const defaultMessageConverterRef = useRef(defaultMessageConverter);
  defaultMessageConverterRef.current = defaultMessageConverter;
  const lastCheckedValueRef = useRef<string | undefined>(undefined);

  const check = useCallback(
    (event?: Event, initialCheck?: boolean) => {
      if (!input) {
        return;
      }

      lastCheckedValueRef.current = input.value;

      const mode = getErrorVisibilityMode(input, errorVisibilityModeProp);

      if (
        mode === "always" ||
        form?.dataset?.onceSubmitted ||
        event?.type === "submit" ||
        (mode === "afterInput" && initialCheck !== true) ||
        (mode === "afterChange" && changedRef.current)
      ) {
        setValidationMessage(
          getValidationMessage(
            input,
            customMessagesRef.current,
            customValidationRef.current,
            defaultMessageConverterRef.current,
          ),
        );
      }
    },
    [input, form, errorVisibilityModeProp],
  );
  const checkRef = useRef(check);
  checkRef.current = check;

  useEffect(() => {
    if (!input) {
      return () => {
        /* Noop */
      };
    }

    const onChange = () => {
      changedRef.current = true;

      check();
    };

    input.addEventListener("blur", onChange);
    form?.addEventListener("submit", check);
    if (!isControlled) {
      input.addEventListener("input", check);
    }

    check(undefined, true);

    return () => {
      input.removeEventListener("blur", onChange);
      form?.removeEventListener("submit", check);
      if (!isControlled) {
        input.removeEventListener("input", check);
      }
    };
  }, [input, form, check, isControlled]);

  useEffect(() => {
    if (
      !input ||
      propsValue === undefined ||
      lastCheckedValueRef.current === undefined ||
      String(propsValue) === lastCheckedValueRef.current
    ) {
      return;
    }

    if (input !== document.activeElement) {
      changedRef.current = true;
    }

    checkRef.current();
  }, [propsValue, input]);

  const inputRef = useCallback(
    (el: FormControl | null) => {
      setInput(el);

      // for Mui 5 Select
      checkRef.current(undefined, true);

      if (!inputRefProp) {
        return;
      }

      if (typeof inputRefProp === "function") {
        inputRefProp(el);
      } else {
        // eslint-disable-next-line react-hooks/immutability
        inputRefProp.current = el;
      }
    },
    [inputRefProp, setInput],
  );

  return {
    validationMessage,
    inputRef,
  };
};
