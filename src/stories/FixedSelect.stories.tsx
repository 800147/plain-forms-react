import type { Meta, StoryObj } from "@storybook/react-vite";

import { Form } from "../components/Form/Form";
import {
  BrokenSelect,
  type BrokenSelectProps,
} from "./with-plain-forms-react/BrokenSelect";
import { useState, type FunctionComponent } from "react";

const WholeForm: FunctionComponent<BrokenSelectProps> = (props) => {
  const [value, setValue] = useState("");

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid">
        <BrokenSelect
          value={value}
          onChange={(e) => {
            setValue(e.currentTarget.value);
          }}
          {...props}
        />
        <button type="submit">Submit</button>
      </div>
    </Form>
  );
};

const meta = {
  title: "Example/FixedSelect",
  component: BrokenSelect,
  args: {},
  render: (props) => <WholeForm {...props} />,
} satisfies Meta<typeof BrokenSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {
  args: {
    label: "Fixed select",
    required: true,
    children: (
      <>
        <option value="">--empty--</option>
        <option value="one">option one</option>
        <option value="two">option two</option>
      </>
    ),
  },
};
