# Technical Plan: Sign-out Redirect, Command Normalization, and Navbar User Menu

## Architecture Changes

### 1. Auth & Redirection
- **Location:** `src/app/layout/Navbar.jsx`
- **Change:** Convert `handleLogout` to an `async` function.
- **Logic:**
  ```javascript
  const handleLogout = async () => {
    await logout();
    closeSidebar();
    navigate('/');
  };
  ```
- **Context:** Ensure `AuthContext`'s `logoutSession` resolves correctly.

### 2. Command Normalization
- **Location:** `src/features/commands/create/CreateCmd.jsx`
- **Change:** Update `triggerInput` state handling.
- **Logic:**
  - Modify `onChange` of the trigger input to check for leading `/`.
  - If it's missing, prepend it.
  - Prevent the user from deleting the initial `/`.
- **Refinement:** Use `normalizeCommandTrigger` from `commandUtils.js` during the `onChange` event or just before submission. To meet the "typing hi1 sends /hi1" requirement, simple normalization on submit is already there, but we will make it more proactive in the UI.

### 3. Navbar User Dropdown
- **Location:** `src/app/layout/Navbar.jsx` & `src/app/layout/Navbar.css`
- **Change:**
  - Add `isUserMenuOpen` state.
  - Wrap the `user-section` in a container that handles the dropdown.
  - Use `onClickOutside` pattern or a simple state toggle.
  - Update JSX to show the menu when `isUserMenuOpen` is true.
- **Styling:**
  - Create a dropdown menu that floats above/near the user profile.
  - Add icons for Settings (Gear), Sign off (Arrow/Exit), Terminate (Power/Warning).

## Technology Stack
- **Framework:** React
- **Icons:** SVG (inline) or FontAwesome (if available, but we'll stick to inline SVG to match existing style).
- **Routing:** React Router (`useNavigate`).

## Constraints & Considerations
- **Accessibility:** Ensure the dropdown is keyboard-accessible (ARIA attributes).
- **Mobile:** The dropdown should work within the mobile sidebar or be adapted.
- **Existing Logic:** Maintain the `buddyLogo` and sidebar toggle functionality.
