import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Form } from "../components/Form/Form";
import { Input } from "./wrappedHtml/Input";
import type { FunctionComponent } from "react";

const ControlledFields: FunctionComponent = () => {
  const [value, setValue] = useState("");

  return (
    <div className="grid">
      <Input
        label="Required field"
        type="text"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Input
        label="Same field"
        type="text"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </div>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Form",
  component: Form,
  args: {
    onSubmit: fn(),
    children: (
      <div className="grid">
        <Input label="Required field" type="text" required />
        <button type="submit">Submit</button>
      </div>
    ),
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ValidationAfterSubmit: Story = {
  args: {
    errorVisibilityMode: "afterSubmit",
  },
};

export const ValidationAfterChange: Story = {
  args: {
    errorVisibilityMode: "afterChange",
  },
};

export const ValidationAfterInput: Story = {
  args: {
    errorVisibilityMode: "afterInput",
  },
};

export const ValidationAlways: Story = {
  args: {
    errorVisibilityMode: "always",
  },
};

export const InputsOutsideForm: Story = {
  args: {
    children: [],
  },
  render: (props) => (
    <>
      <Form id="separate-form" className="visually-hidden" {...props} />
      <div className="grid">
        <Input
          form="separate-form"
          label="Required field"
          type="text"
          required
        />
        <button form="separate-form" type="submit">
          submit
        </button>
      </div>
    </>
  ),
};

export const WithControlledFields: Story = {
  args: {
    errorVisibilityMode: "afterInput",
    children: <ControlledFields />,
  },
};
