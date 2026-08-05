import { Link, UI } from "/modules/std/components/index.ts";

export const HomePage = () => {
  return (
    <>
      <UI.Text variant="titleMedium">std Component Example Page</UI.Text>
      <UI.Text variant="bodySmall">This contains every component that std exports</UI.Text>
      <UI.Text variant="bodySmall">
        You can use this to see how to use the components and what props it accepts
      </UI.Text>
      <Link replace={true} to="/spicetify/test/ReactComponent">
        <UI.Text variant="bodySmall">Go to React Component Page</UI.Text>
      </Link>
      <Link replace={true} to="/spicetify/test/EncoreComponent">
        <UI.Text variant="bodySmall"> Go to Encore Component Page</UI.Text>
      </Link>
    </>
  );
};
