import {
  type FunctionComponent,
  type ReactNode,
  type HTMLProps,
  type CSSProperties,
} from "react";

const noop = () => {
  /* noop */
};

export interface ControlWrapperProps extends HTMLProps<HTMLInputElement> {
  className?: string;
  inputClassname?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  noStyles?: boolean;
  children?: ReactNode;
}

export const ControlWrapper: FunctionComponent<ControlWrapperProps> = ({
  className,
  inputClassname,
  children,
  style,
  inputStyle,
  ...props
}) => (
  <div className={className} style={{ position: "relative", ...style }}>
    <input
      className={inputClassname}
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0,
        pointerEvents: "none",
        ...inputStyle,
      }}
      tabIndex={-1}
      aria-hidden="true"
      onChange={props.value === undefined ? undefined : noop}
      data-control-wrapper
      {...props}
    />
    {children}
  </div>
);
