import { type Ref, useCallback, useEffect, useRef, useState } from "react";
import type { ErrorVisibilityMode } from "../types";

export type FormControl =
  | HTMLTextAreaElement
  | HTMLInputElement
  | HTMLSelectElement;
export type Invalidity = Exclude<keyof ValidityState, "valid">;
export type CustomMessages = Partial<
  Record<Invalidity, string | ((input: FormControl) => string)>
>;

// This replace ditches the last dot (for Firefox)
const noDotMessage = (input: FormControl) =>
  input.validationMessage.replace(/\.$/, "");

const getValidationMessage = (
  input: FormControl,
  customMessages: CustomMessages,
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

  for (let i = 0; i < order.length; i += 1) {
    const key = order[i];

    if (input.validity[key]) {
      const customMessage = customMessages[key];

      switch (typeof customMessage) {
        case "string":
          return customMessage;
        case "function":
          return customMessage(input);
        default:
          return noDotMessage(input);
      }
    }
  }

  return noDotMessage(input);
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
  customMessages?: CustomMessages;
  errorVisibilityMode?: ErrorVisibilityMode;
  inputRef?: Ref<FormControl | null>;
}) => {
  inputRef: (el: FormControl | null) => void;
  validationMessage?: string;
};

export const usePlainValidation: usePlainValidationType = ({
  customMessages = {},
  errorVisibilityMode: errorVisibilityModeProp,
  inputRef: inputRefProp,
} = {}) => {
  const [validationMessage, setValidationMessage] = useState<string>();
  const [input, setInput] = useState<FormControl | null>(null);
  const form = input?.form;
  const changedRef = useRef(false);
  const customMessagesRef = useRef(customMessages);
  customMessagesRef.current = customMessages;

  const check = useCallback(
    // initialCheck can be Event if check is used as event handler
    (initialCheck?: boolean | Event) => {
      if (!input) {
        return;
      }

      const mode = getErrorVisibilityMode(input, errorVisibilityModeProp);

      if (
        mode === "always" ||
        form?.dataset?.onceSubmitted ||
        (initialCheck as Event)?.type === "submit" ||
        (mode === "afterInput" && initialCheck !== true) ||
        (mode === "afterChange" && changedRef.current)
      ) {
        setValidationMessage(
          getValidationMessage(input, customMessagesRef.current),
        );
      }
    },
    [input, form, customMessagesRef, errorVisibilityModeProp],
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

    input.addEventListener("change", onChange);
    input.addEventListener("input", check);
    form?.addEventListener("submit", check);

    check(true);

    return () => {
      input.removeEventListener("change", onChange);
      input.removeEventListener("input", check);
      form?.removeEventListener("submit", check);
    };
  }, [input, form, check]);

  const inputRef = useCallback(
    (el: FormControl | null) => {
      setInput(el);

      // for Mui 5 Select
      checkRef.current(true);

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
