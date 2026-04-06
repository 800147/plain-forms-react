import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "./with-plain-forms-react/Select";
import { Form } from "plain-forms-react";

const meta = {
  title: "Example/Select",
  component: Select,
  args: {},
  render: (props) => (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      errorVisibilityMode="afterChange"
    >
      <div className="grid">
        <Select {...props} />
        <button type="submit">Submit</button>
      </div>
    </Form>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {
  args: {
    label: "Select",
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
