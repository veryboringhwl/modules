import {
  SettingsRow,
  SettingsRowEnd,
  SettingsRowStart,
  SettingsSection,
  Toggle,
  UI
} from "/modules/std/components/index.ts";
import { signal } from "/modules/std/core/index.ts";
import { React } from "/modules/std/libs/index.ts";

export const TestSettingsSection = () => {
  const [, refresh] = React.useReducer((n) => n + 1, 0);
  const [isChecked, setIsChecked] = React.useState(false);

  React.useEffect(() => {
    signal.pull(refresh);
  }, [refresh]);

  return (
    <SettingsSection filterMatchQuery="test">
      <UI.Text as="h2" semanticColor="textBase" variant="bodyMediumBold">
        Settings Section Title
      </UI.Text>
      <SettingsRow>
        <SettingsRowStart>
          <UI.Text as="label" semanticColor="textSubdued" variant="bodySmall">
            Settings Section Example
          </UI.Text>
        </SettingsRowStart>
        <SettingsRowEnd>
          <Toggle
            id="toggle-probe"
            onSelected={(newValue: boolean) => {
              setIsChecked(newValue);
            }}
            value={isChecked}
          />
        </SettingsRowEnd>
      </SettingsRow>
    </SettingsSection>
  );
};
