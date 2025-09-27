# Component Library

This screen demonstrates three reusable components: `PrimaryButton`, `SecondaryButton`, and `ToggleSwitch`.

## Components

### PrimaryButton
- **Props**
  - `title` (string) – text on the button
  - `onPress` (function) – callback when button is pressed

### SecondaryButton
- **Props**
  - `title` (string)
  - `onPress` (function)

### ToggleSwitch
- **Props**
  - `label` (string) – text next to the switch
  - `value` (boolean) – current switch state
  - `onValueChange` (function) – called when switch changes

## Example Usage

```jsx
<PrimaryButton title="Save" onPress={() => console.log('Saved!')} />
<SecondaryButton title="Cancel" onPress={() => console.log('Cancelled')} />
<ToggleSwitch
  label="Enable feature"
  value={isEnabled}
  onValueChange={setIsEnabled}
/>
