import { React } from "/modules/stdlib/src/expose/React.ts";
import { TopbarLeftButton } from "/modules/stdlib/src/registers/topbarLeftButton.tsx";
import { UI } from "/modules/stdlib/src/webpack/ComponentLibrary.ts";
import { Dialog } from "/modules/stdlib/src/webpack/ReactComponents.ts";

import { Modal } from "../modal/Modal.tsx";

function _Icon() {
  return (
    // this size is overrided by the topbar button component
    <UI.Icon size="medium" viewBox="0 0 24 24">
      <path
        d="M.75 1.35h2.5l.625 3.45m0 0L5.75 16.35H19.2L23.25 4.775H3.875zm2.75 15.95a.625.625 0 101.5 0 .625.625 0 10-1.5 0m10 0a.625.625 0 101.5 0 .625.625 0 10-1.5 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </UI.Icon>
  );
}

export const TestTopbarLeftButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Dialog
        animated={true}
        isOpen={isOpen}
        onCancel={handleClose}
        onClose={handleClose}
        unmountWhenClose={false}
      >
        <Modal onClose={handleClose} />
      </Dialog>
      <TopbarLeftButton
        icon={
          <UI.Icon size="medium" viewBox="0 0 24 24">
            <path
              d="M.75 1.35h2.5l.625 3.45m0 0L5.75 16.35H19.2L23.25 4.775H3.875zm2.75 15.95a.625.625 0 101.5 0 .625.625 0 10-1.5 0m10 0a.625.625 0 101.5 0 .625.625 0 10-1.5 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </UI.Icon>
        }
        label="Topbar Button"
        onClick={() => setIsOpen(true)}
      />
    </>
  );
};
