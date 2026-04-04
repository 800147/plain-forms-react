import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "./with-plain-forms-react/Select";

const meta = {
  title: "Example/BrokenSelect",
  component: Select,
  args: {},
  render: (props) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid">
        <Select {...props} />
        <button type="submit">Submit</button>
      </div>
    </form>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {
  args: {
    label: "Broken select",
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
