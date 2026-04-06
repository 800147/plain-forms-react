import { useId, type CSSProperties, type FunctionComponent } from "react";
import { Select, type SelectProps } from "./Select";

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

export type BrokenSelectProps = SelectProps;

export const BrokenSelect: FunctionComponent<BrokenSelectProps> = ({
  selectProps,
  ...props
}) => {
  const id = useId();

  return (
    <>
      <form id={id} style={VISUALLY_HIDDEN} />
      <Select selectProps={{ ...selectProps, form: id }} {...props} />
    </>
  );
};
