import { NavLink } from "/modules/stdlib/src/registers/navlink.tsx";
import { UI } from "/modules/stdlib/src/webpack/ComponentLibrary.ts";

export const TestNavLink = () => (
  <NavLink
    activeIcon={
      <UI.Icon size="medium" viewBox="0 0 24 24">
        <path
          d="M.75 1.35h2.5l.625 3.45m0 0L5.75 16.35H19.2L23.25 4.775H3.875zm2.75 15.95a.625.625 0 101.5 0 .625.625 0 10-1.5 0m10 0a.625.625 0 101.5 0 .625.625 0 10-1.5 0"
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </UI.Icon>
    }
    appRoutePath="/spicetify/test"
    icon={
      <UI.Icon size="medium" viewBox="0 0 24 24">
        <path
          d="M.75 1.35h2.5l.625 3.45m0 0L5.75 16.35H19.2L23.25 4.775H3.875zm2.75 15.95a.625.625 0 101.5 0 .625.625 0 10-1.5 0m10 0a.625.625 0 101.5 0 .625.625 0 10-1.5 0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </UI.Icon>
    }
    localizedApp="Stdlib Test"
  />
);
