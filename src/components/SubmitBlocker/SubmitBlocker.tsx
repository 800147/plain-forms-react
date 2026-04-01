import { type CSSProperties, type FunctionComponent } from "react";
import {
  ControlWrapper,
  type ControlWrapperProps,
} from "../ControlWrapper/ControlWrapper";
import type { ErrorVisibilityMode } from "../../types";
import { usePlainValidation } from "../../hooks/usePlainValidation";

export interface SubmitBlockerProps extends ControlWrapperProps {
  errorVisibilityMode?: ErrorVisibilityMode;
}

const VISUALLY_HIDDEN: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  border: 0,
  padding: 0,

  whiteSpace: "nowrap",
  clipPath: "inset(100%)",
  clip: "rect(0 0 0 0)",
  overflow: "hidden",
};

export const SubmitBlocker: FunctionComponent<SubmitBlockerProps> = ({
  errorVisibilityMode,
  ref: inputRef,
  style,
  ...props
}) => {
  const { inputRef: ref, validationMessage } = usePlainValidation({
    errorVisibilityMode:
      errorVisibilityMode === "afterSubmit" ? "afterSubmit" : "always",
    inputRef,
  });

  return (
    <ControlWrapper
      ref={ref}
      style={validationMessage ? style : VISUALLY_HIDDEN}
      {...props}
      value=""
      required
    />
  );
};
