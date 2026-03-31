import {
  type SubmitEventHandler,
  type FunctionComponent,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import type { ErrorVisibilityMode } from "../../types";

export interface FormProps {
  className?: string;
  children?: ReactNode;
  onSubmit?: SubmitEventHandler<HTMLFormElement>;
  id?: string;
  errorVisibilityMode?: ErrorVisibilityMode;
}

export const Form: FunctionComponent<FormProps> = ({
  className,
  children,
  onSubmit: onSubmitProp,
  id,
  errorVisibilityMode = "afterSubmit",
}) => {
  const [onceSubmitted, setOnceSubmitted] = useState(false);

  const onSubmit = useCallback<SubmitEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();

      setOnceSubmitted(true);

      const firstInvalid: HTMLInputElement | null =
        e.currentTarget.querySelector(":invalid");

      if (!firstInvalid) {
        onSubmitProp?.(e);

        return;
      }

      firstInvalid.scrollIntoView({ block: "center" });

      if (firstInvalid.dataset.controlWrapper) {
        return;
      }

      firstInvalid.focus();
    },
    [onSubmitProp, setOnceSubmitted],
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
