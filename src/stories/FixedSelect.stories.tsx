import type { Meta, StoryObj } from "@storybook/react-vite";

import { Form } from "../components/Form/Form";
import { Select, type SelectProps } from "./with-plain-forms-react/Select";
import { useState, type FunctionComponent } from "react";

const WholeForm: FunctionComponent<SelectProps> = (props) => {
  const [value, setValue] = useState("");

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid">
        <Select
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
  component: Select,
  args: {},
  render: (props) => <WholeForm {...props} />,
} satisfies Meta<typeof Select>;

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
