# Plain-Forms-React

## About

Plain-Forms-React is a library that aims to bring the plain HTML forms
experience to React with component libraries in mind. There are many
approaches to how form validation should work in React. Often, those
solutions require configuring each form and wrapping it in a special React
context that can be annoying. Meanwhile, HTML has its own form validation
mechanism that covers most use cases and works without any
configuration.

Here’s what an HTML form looks like:
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

It’s so simple and yet effective! This form can’t be submitted until all
the requirements are met. And while they are not, the proper error 
messages will appear near the corresponding fields. Also, the page will be
scrolled to the first invalid field, and that field will be focused. The
code above is everything you need to make it work. That’s what we
want from form validation in React — and here’s how it would look with
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

To be fair, this code is not everything you need. You have to make
your own `TextField` component first — using
a `TextField` component from your component library and
the `usePlainValidation` hook from Plain-Forms-React. After that,
the code above will work as expected. You can read about all this in
the documentation.

## How it works

To copy the native HTML form behaviour, we simply use native HTML forms
under the hood. There are two core parts of the library:

1. `Form` component — it’s just an HTML `form` element
   with some JavaScript around it to make everything work.
2. `usePlainValidation` hook — a React hook that should be
   used to wrap form control components provided by your component
   library. It connects to `input`/`textarea`/`select`
   element inside the component and gets the validation status from it.

These two parts use native HTML forms, and the JavaScript around them
brings their validation state to React components.

If your component doesn’t use a native HTML control inside it, you can use
the `ControlWrapper` — a component that contains an invisible `input`
element specifically for such cases.

## Getting started

### Installation

Installation of the library is pretty common:
```bash
npm install plain-forms-react
```

It will require you to install react and react-dom as peer dependencies,
but that’s pretty much it. No other dependencies are needed.

### Preparing components

One of the principles of Plain-Forms-React is passing the validation
status of native HTML controls to the props of React components. So you
have to prepare your components to work properly. Just wrap form
control components with a HOC using the `usePlainValidation` hook.

Here’s an example of how it might look for a `TextField` component:
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

Here’s what we’re doing here:

* Pass the `controlRef` from the hook to the native `input` element inside
  `UiTextField`, so the hook can work with it. To keep the
  `inputProps.ref` prop of the component working, we pass it as an argument
  to the hook.
* Make the `input` props that are important for native HTML validation
  easier to access by making them top-level props.
* Pass the `validationMessage` returned from the hook to the `errorMessage`
  field of the component.
* Add the `defaultMessageConverter`, `customMessages`,
  `customValidation`, and `errorVisibilityMode` props to our new
  component to pass them to the hook if needed (all of these are optional).

After that, you need to do the same thing with `Select`, `Checkbox`,
and other form control components from your component library.

If, for some reason, a control component from your component library
does not use a native control element under the hood or does not give
you the ability to access it, you can use a wrapper made specifically for
that case — the `ControlWrapper`.

### Using the form

Now, when you’ve set everything up properly, you can use the `Form`
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

* Of course, you should use your own prepared version of the `TextField`
  here.
* You can specify error visibility modes using the `errorVisibilityMode`
  prop. All available options are: `"afterSubmit"` (default), `"afterChange"`,
  `"afterInput"`, `"always"`.
* Don’t forget to apply the `preventDefault` function to prevent the
  default behaviour of the form if needed.

Also, since we use HTML controls, you can even position your fields
outside of the form and link them together by the form id:

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

Some errors are related not to one, but to several fields. You can use
the `SubmitBlocker` component to add those errors, make them appear
in accordance with the selected error visibility mode, and block the form
submission. Here’s how it works:

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

## That’s it!

That’s everything you should know to start using Plain-Forms-React. Have fun :)

## Thanks

Thanks to Víctor Lillo for
[the article](https://victorlillo.dev/blog/react-typescript-vite-component-library) that helped me configure this library.
