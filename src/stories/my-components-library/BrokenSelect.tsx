import { type FunctionComponent } from "react";
import { Select, type SelectProps } from "./Select";

export type BrokenSelectProps = SelectProps;

export const BrokenSelect: FunctionComponent<BrokenSelectProps> = ({
  selectProps,
  ...props
}) => (
  <Select
    selectProps={{ ...selectProps, form: "non-existent-form" }}
    {...props}
  />
);
