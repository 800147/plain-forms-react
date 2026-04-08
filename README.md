# Plain-Forms-React

## About

Plain-Forms-React is a library that aims to bring the plain HTML forms
experience to React with component libraries in mind. There are many
approaches on how form validation should work in React. Often those
solutions require to configure each form and wrap it in special React
context that can be annoying. Meanwhile HTML has its own form validation
mechanism that covers most of the use cases and works without any
configuration.

Here's how html forms looks like:
```html
<form>
  <input type="email" required>
  <input
    type="number"
    min="0"
    max="100"
    step="10"
  >
  <button type="submit">submit</button>
</form>
```

It's so simple and yet effective! This form can't be submitted until all
the requirements are met. And while they are not, the proper error 
messages will appear near corresponding fields. Also the page will be 
scrolled to first invalid field and that field will be focused. And the 
code above is everything you need to do to make it work. That's what we
want from form validation in React and here's how it would look like with 
Plain-Forms-React:

```html
<Form>
  <TextField type="email" required />
  <TextField
    type="number"
    min="0"
    max="100"
    step="10"
  />
  <Button type="submit">submit</Button>
</Form>
```

To be fair, this code is not everything you need to do. You have to make
your own `TextField` component first using
`TextField` component of your component library and
`usePlainValidation` hook from Plain-Forms-React. And then
the code above will work as expected. You can read about all that in
this documentation.

## How it works

To copy the native HTML form behaviour, we just use native HTML forms
under the hood. There are two core parts of the library:

1. `Form` component — it's just an HTML `form` element
and some javascript around it to make everything work.
2. `usePlainValidation` hook — a React hook that should be
used to wrap form controls components provided by your components
library. It connects to `input`/`textarea`/`select`
elements inside the components and gets validation status from it.

Those two parts just use native HTML forms and javascript around them
brings their validation state to React components.

If your component doesn't use native HTML control inside it, you can use
`ControlWrapper` — a component that contains invisible `input`
element specifically for such cases.


## Getting started

### Installation

Installation of the library is pretty common:
```bash
npm install plain-forms-react@latest
```

It will require you to install react and react-dom as peer dependencies
but that's pretty much it. No other dependencies needed.

### Preparing components

One of the principles of Plain-Forms-React is passing the validation
status of native HTML controls to props of React components. So you
have to prepare your components to work properly. Just wrap form
controls components with a HOC using `usePlainValidation` hook.

Here is the example of how it might look for `TextField` component:
```tsx
import type { HTMLProps } from "react";
import {
  TextField as UiTextField,
  type TextFieldProps as UiTextFieldProps,
} from "my-components-library";
import {
  usePlainValidation,
  type CustomMessages,
  type CustomValidationFunction,
  type DefaultMessageConverterFunction,
  type ErrorVisibilityMode,
} from "plain-forms-react";

export interface TextFieldProps extends UiTextFieldProps {
  defaultMessageConverter?: DefaultMessageConverterFunction;
  customMessages?: CustomMessages;
  customValidation?: CustomValidationFunction;
  errorVisibilityMode?: ErrorVisibilityMode;
  disabled?: HTMLProps<HTMLInputElement>["disabled"];
  form?: HTMLProps<HTMLInputElement>["form"];
  name?: HTMLProps<HTMLInputElement>["name"];
  inputMode?: HTMLProps<HTMLInputElement>["inputMode"];
  max?: HTMLProps<HTMLInputElement>["max"];
  maxLength?: HTMLProps<HTMLInputElement>["maxLength"];
  min?: HTMLProps<HTMLInputElement>["min"];
  minLength?: HTMLProps<HTMLInputElement>["minLength"];
  pattern?: HTMLProps<HTMLInputElement>["pattern"];
  size?: HTMLProps<HTMLInputElement>["size"];
  step?: HTMLProps<HTMLInputElement>["step"];
  type?: HTMLProps<HTMLInputElement>["type"];
}

export const TextField = ({
  defaultMessageConverter,
  customMessages,
  customValidation,
  errorVisibilityMode,
  disabled,
  form,
  name,
  inputMode,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  size,
  step,
  type,
  inputProps,
  errorMessage,
  ...props
}: TextFieldProps) => {
  const { controlRef, validationMessage } = usePlainValidation({
    defaultMessageConverter,
    customMessages,
    customValidation,
    errorVisibilityMode,
    controlRefProp: inputProps?.ref,
    valueProp: props.value,
  });

  return (
    <UiTextField
      errorMessage={errorMessage || validationMessage}
      inputProps={{
        ...inputProps,
        ref: controlRef,
        disabled,
        form,
        name,
        inputMode,
        max,
        maxLength,
        min,
        minLength,
        pattern,
        size,
        step,
        type,
      }}
      {...props}
    />
  );
};
```

Here's what we are doing here:

* Pass the `controlRef` from the hook to native `input` element inside
  `UiTextField` so the hook can work with it. To keep the
  `inputProps.ref` prop of the component working, we pass it to hooks
  arguments.
* Make `input` props that important for native HTML validation
  easier to reach making them top level props.
* Pass `validationMessage` returned from the hook to `errorMessage`
  field of the component.
* Add `defaultMessageConverter`, `customMessages`,
  `customValidation` and `errorVisibilityMode` props to our new
  component to pass them to the hook if needed (they all optional).

After that you need to do the same thing with `Select`, `Checkbox`
and other form control components of your components library.

If for some reason a control component from your components library
does not use native control element under the hood or does not give
you ability to reach it, you can use a wrapper made specifically for
that case — `ControlWrapper`.

### Using the form

Now when you set everything up properly, you can use `Form`
component

```html
<Form
  errorVisibilityMode="afterChange"
  onSubmit={(e) => {
    e.preventDefault();

    // Do my submit stuff
  }}
>
  <TextField type="email" required />
  <TextField
    type="number"
    min="0"
    max="100"
    step="10"
  />
  <Button type="submit">submit</Button>
</Form>
```

* Ofcourse you should use your own prepared version of the `TextField`
here.
* You can specify error visibility modes using `errorVisibilityMode`
prop. All options are: `"afterSubmit"` (default), `"afterChange"`,
`"afterInput"`, `"always"`
* Don't forget to apply `preventDefault` function to prevent the
default behaviour of the form if you need.

Also since we use HTML controls, you can even position your fields 
outside of the form and link them together by form id:

```tsx
<header>
  <TextField form="footer-form" required />
</header>
<footer>
  <Form id="footer-form">
    <button type="submit">submit</button>
  </Form>
</footer>
```

### Cross-field errors

Some errors are related with not one but several fields. You can use
`SubmitBlocker` component to add those errors, make them appear 
respecting selected error visibility mode and block the form 
submittion. Here's how it works:

```tsx
const MyForm: FunctionComponent = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <Form>
      <TextField
        label="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        type="number"
        required
      />
      <TextField
        label="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        type="number"
        required
      />
      {Number(to) < Number(from) && (
        <SubmitBlocker>
          "To" can't be less than "From"
        </SubmitBlocker>
      )}
      <button type="submit">Submit</button>
    </Form>
  );
};
```

## That's it!

It's everything you should know to start using Plain-Forms-React. Have fun :)

## Thanks

Thanks to Víctor Lillo for 
[the article](https://victorlillo.dev/blog/react-typescript-vite-component-library) that helped me to configure this library
