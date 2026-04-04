import type { Meta, StoryObj } from "@storybook/react-vite";

import { Form } from "../components/Form/Form";
import { TextField } from "./with-plain-forms-react/TextField";

const meta = {
  title: "Example/usePlainValidation",
  component: TextField,
  args: {},
  render: (props) => (
    <Form>
      <div className="grid">
        <TextField {...props} />
        <button type="submit">submit</button>
      </div>
    </Form>
  ),
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ValidationAfterSubmit: Story = {
  args: {
    errorVisibilityMode: "afterSubmit",
    label: 'errorVisibilityMode="afterSubmit"',
    required: true,
  },
};

export const ValidationAfterChange: Story = {
  args: {
    errorVisibilityMode: "afterChange",
    label: 'errorVisibilityMode="afterChange"',
    required: true,
  },
};

export const ValidationAfterInput: Story = {
  args: {
    errorVisibilityMode: "afterInput",
    label: 'errorVisibilityMode="afterInput"',
    required: true,
  },
};

export const ValidationAlways: Story = {
  args: {
    errorVisibilityMode: "always",
    label: 'errorVisibilityMode="always"',
    required: true,
  },
};

export const TypeNumber: Story = {
  args: {
    errorVisibilityMode: "always",
    label: 'type="number"',
    min: 0,
    max: 100,
    step: 10,
    type: "number",
  },
};

export const DefaultMessageConverter: Story = {
  args: {
    errorVisibilityMode: "always",
    label: 'type="number"',
    min: 0,
    max: 100,
    step: 10,
    type: "number",
    defaultMessageConverter: (message) => `Hey, ${message.toLocaleLowerCase()}`,
  },
};

export const CustomMessages: Story = {
  args: {
    errorVisibilityMode: "always",
    label: 'type="number"',
    min: 0,
    max: 100,
    step: 10,
    type: "number",
    customMessages: {
      badInput: "number only",
      rangeUnderflow: "min 0",
      rangeOverflow: "max 100",
      stepMismatch: (input) =>
        `try ${Math.floor(Number(input.value) / 10) * 10} or ${Math.ceil(Number(input.value) / 10) * 10}`,
    },
  },
};

export const CustomValidation: Story = {
  args: {
    errorVisibilityMode: "always",
    label: "Type palindrome here",
    type: "text",
    customValidation: (value) => {
      const letters = value.replaceAll(/\W/g, "").toLowerCase();

      if (letters !== letters.split("").reverse().join("")) {
        return "not a palindrome";
      }
    },
  },
};
