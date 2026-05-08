# Tasks: Sign-out Redirect, Command Normalization, and Navbar User Menu

## Phase 1: Sign-out Redirection
- [ ] Update `handleLogout` in `Navbar.jsx` to be async and ensure navigation to `/`.
- [ ] Verify that `logout()` in `AuthContext` correctly clears state before navigation.

## Phase 2: Command Normalization (CreateCmd)
- [ ] Update `CreateCmd.jsx` to enforce leading `/` in `triggerInput` during `onChange`.
- [ ] Ensure `normalizeCommandTrigger` is used consistently.
- [ ] (Optional) Add a visual hint or pre-fill the input with `/`.

## Phase 3: Navbar User Menu
- [ ] Add `isUserMenuOpen` state to `Navbar.jsx`.
- [ ] Implement `toggleUserMenu` function.
- [ ] Refactor `user-section` JSX to support a dropdown.
- [ ] Add "Settings", "Sign off", and "Terminate" items to the dropdown.
- [ ] Add SVG icons for each menu item.
- [ ] Update `Navbar.css` with dropdown styles (positioning, hover states, animations).
- [ ] Implement click-away logic to close the menu.

## Phase 4: Validation
- [ ] Test sign-out flow from various pages.
- [ ] Test command creation with and without manual `/`.
- [ ] Test navbar dropdown on desktop and mobile viewports.
