import {
  type SubmitEventHandler,
  type FunctionComponent,
  type ReactNode,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import type { ErrorVisibilityMode } from "../../types";
import type { FormControl } from "../../hooks/usePlainValidation";

export interface FormProps {
  className?: string;
  children?: ReactNode;
  onSubmit?: SubmitEventHandler<HTMLFormElement>;
  onSubmitDeny?: SubmitEventHandler<HTMLFormElement>;
  id?: string;
  errorVisibilityMode?: ErrorVisibilityMode;
  preventFirstInvalidScroll?: boolean;
  preventFirstInvalidFocus?: boolean;
}

export const Form: FunctionComponent<FormProps> = ({
  className,
  children,
  onSubmit: onSubmitProp,
  onSubmitDeny,
  id,
  errorVisibilityMode = "afterSubmit",
  preventFirstInvalidScroll,
  preventFirstInvalidFocus,
}) => {
  const [onceSubmitted, setOnceSubmitted] = useState(false);
  const onSubmitRef = useRef(onSubmitProp);
  const onSubmitDenyRef = useRef(onSubmitDeny);

  useEffect(() => {
    onSubmitRef.current = onSubmitProp;
    onSubmitDenyRef.current = onSubmitDeny;
  });

  const onSubmit = useCallback<SubmitEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();

      setOnceSubmitted(true);

      const firstInvalid: FormControl | null = Array.from(
        (e.currentTarget as HTMLFormElement).elements,
      ).find(
        (el) =>
          (el as FormControl).validity && !(el as FormControl).validity.valid,
      ) as FormControl | null;

      if (!firstInvalid) {
        onSubmitRef.current?.(e);

        return;
      }

      if (!preventFirstInvalidScroll) {
        firstInvalid.scrollIntoView({ block: "center" });
      }

      if (!preventFirstInvalidFocus && !firstInvalid.dataset.controlWrapper) {
        firstInvalid.focus();
      }

      onSubmitDenyRef.current?.(e);
    },
    [setOnceSubmitted, preventFirstInvalidScroll, preventFirstInvalidFocus],
  );

  return (
    <form
      className={className}
      onSubmit={onSubmit}
      id={id}
      noValidate
      data-once-submitted={onceSubmitted || undefined}
      data-error-visibility-mode={errorVisibilityMode}
    >
      {children}
    </form>
  );
};
