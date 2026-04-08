import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Form } from "../components/Form/Form";
import { TextField } from "./with-plain-forms-react/TextField";
import type { FunctionComponent } from "react";

const ControlledFields: FunctionComponent = () => {
  const [value, setValue] = useState("");

  return (
    <div className="grid">
      <TextField
        label="Required field"
        type="text"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <TextField
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
    onSubmitDeny: fn(),
    children: (
      <div className="grid">
        <TextField label="Required field" type="text" required />
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
  args: {},
  render: (props) => (
    <>
      <div className="grid">
        <header>
          <TextField
            form="footer-form"
            label="Required field"
            type="text"
            required
          />
        </header>
        <footer>
          <Form id="footer-form" {...props}>
            <button type="submit">submit</button>
          </Form>
        </footer>
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
