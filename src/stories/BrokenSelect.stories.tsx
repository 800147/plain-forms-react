import type { Meta, StoryObj } from "@storybook/react-vite";

import { BrokenSelect } from "./wrappedHtml/BrokenSelect";

const meta = {
  title: "Example/BrokenSelect",
  component: BrokenSelect,
  args: {},
  render: (props) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid">
        <BrokenSelect {...props} />
        <button type="submit">Submit</button>
      </div>
    </form>
  ),
} satisfies Meta<typeof BrokenSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {
  args: {
    label: "Broken select",
    required: true,
    children: (
      <>
        <option value="">--empty--</option>,
        <option value="one">option one</option>,
        <option value="two">option two</option>,
      </>
    ),
  },
};
