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
  Record<Invalidity, string | ((control: FormControl) => string)>
>;

export type CustomValidationFunction = (
  value: string,
  control: FormControl,
) => string | undefined;

export type DefaultMessageConverterFunction = (message: string) => string;

const noConverter: DefaultMessageConverterFunction = (message) => message;

const getValidationMessage = (
  control: FormControl,
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

  const customValidationResult = customValidation?.(control.value, control);

  if (customValidationResult) {
    return customValidationResult;
  }

  for (let i = 0; i < order.length; i += 1) {
    const key = order[i];

    if (control.validity[key]) {
      const customMessage = customMessages?.[key];

      switch (typeof customMessage) {
        case "string":
          return customMessage;
        case "function":
          return customMessage(control);
        default:
          return (
            control.validationMessage &&
            defaultMessageConverter(control.validationMessage)
          );
      }
    }
  }

  return (
    control.validationMessage &&
    defaultMessageConverter(control.validationMessage)
  );
};

const getErrorVisibilityMode = (
  control: FormControl,
  errorVisibilityModeProp?: ErrorVisibilityMode,
): ErrorVisibilityMode => {
  if (errorVisibilityModeProp) {
    return errorVisibilityModeProp;
  }

  return (
    (control.form?.dataset?.errorVisibilityMode as
      | ErrorVisibilityMode
      | undefined) ?? "afterSubmit"
  );
};

type usePlainValidationType = (props?: {
  defaultMessageConverter?: DefaultMessageConverterFunction;
  customMessages?: CustomMessages;
  customValidation?: CustomValidationFunction;
  errorVisibilityMode?: ErrorVisibilityMode;
  controlRefProp?: Ref<FormControl | null>;
  /** For controlled components */
  valueProp?: AllHTMLAttributes<FormControl>["value"];
}) => {
  controlRef: (el: FormControl | null) => void;
  validationMessage?: string;
};

export const usePlainValidation: usePlainValidationType = ({
  defaultMessageConverter,
  customMessages,
  customValidation,
  errorVisibilityMode: errorVisibilityModeProp,
  controlRefProp,
  valueProp,
} = {}) => {
  const [validationMessage, setValidationMessage] = useState<string>();
  const [control, setControl] = useState<FormControl | null>(null);
  const form = control?.form;
  const isControlled = valueProp !== undefined;
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
      if (!control) {
        return;
      }

      lastCheckedValueRef.current = control.value;

      const mode = getErrorVisibilityMode(control, errorVisibilityModeProp);

      if (
        mode === "always" ||
        form?.dataset?.onceSubmitted ||
        event?.type === "submit" ||
        (mode === "afterInput" && initialCheck !== true) ||
        (mode === "afterChange" && changedRef.current)
      ) {
        setValidationMessage(
          getValidationMessage(
            control,
            customMessagesRef.current,
            customValidationRef.current,
            defaultMessageConverterRef.current,
          ),
        );
      }
    },
    [control, form, errorVisibilityModeProp],
  );
  const checkRef = useRef(check);
  checkRef.current = check;

  useEffect(() => {
    if (!control) {
      return () => {
        /* Noop */
      };
    }

    const onChange = () => {
      changedRef.current = true;

      check();
    };

    control.addEventListener("blur", onChange);
    form?.addEventListener("submit", check);
    if (!isControlled) {
      control.addEventListener("input", check);
    }

    check(undefined, true);

    return () => {
      control.removeEventListener("blur", onChange);
      form?.removeEventListener("submit", check);
      if (!isControlled) {
        control.removeEventListener("input", check);
      }
    };
  }, [control, form, check, isControlled]);

  useEffect(() => {
    if (
      !control ||
      valueProp === undefined ||
      lastCheckedValueRef.current === undefined ||
      String(valueProp) === lastCheckedValueRef.current
    ) {
      return;
    }

    if (control !== document.activeElement) {
      changedRef.current = true;
    }

    checkRef.current();
  }, [valueProp, control]);

  const controlRef = useCallback(
    (el: FormControl | null) => {
      setControl(el);

      // for Mui 5 Select
      checkRef.current(undefined, true);

      if (!controlRefProp) {
        return;
      }

      if (typeof controlRefProp === "function") {
        controlRefProp(el);
      } else {
        // eslint-disable-next-line react-hooks/immutability
        controlRefProp.current = el;
      }
    },
    [controlRefProp, setControl],
  );

  return {
    validationMessage,
    controlRef,
  };
};
