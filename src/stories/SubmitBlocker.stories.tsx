import { type FunctionComponent, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Form } from "../components/Form/Form";
import { Input } from "./wrappedHtml/Input";
import {
  SubmitBlocker,
  type SubmitBlockerProps,
} from "../components/SubmitBlocker/SubmitBlocker";

const WholeForm: FunctionComponent<SubmitBlockerProps> = (props) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid">
        <Input
          label="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          type="number"
          required
        />
        <Input
          label="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          type="number"
          required
        />
        {Number(to) < Number(from) && (
          <SubmitBlocker {...props}>
            <div
              style={{
                color: "light-dark(darkred, red)",
                fontSize: "0.75rem",
                fontFamily: "sans-serif",
              }}
            >
              "To" can't be less than "From"
            </div>
          </SubmitBlocker>
        )}
        <button type="submit">Submit</button>
      </div>
    </Form>
  );
};

const meta = {
  title: "Example/SubmitBlocker",
  component: SubmitBlocker,
  render: (props) => <WholeForm {...props} />,
} satisfies Meta<typeof SubmitBlocker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ErrorVisibilityModeAfterChange: Story = {
  args: {
    errorVisibilityMode: "afterChange",
  },
};
