import { PanelContainer, PanelContent, PanelHeader } from "/modules/std/components/index.ts";

export function TestPanel() {
  return (
    <PanelContainer label="TestPanel">
      <PanelContent>
        <PanelHeader title="This is Panel Header" />
        do stuff
      </PanelContent>
    </PanelContainer>
  );
}
