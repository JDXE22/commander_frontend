# Feature Specification: Sign-out Redirect, Command Normalization, and Navbar User Menu

## Overview
This feature encompasses three UX improvements to the Commander application:
1.  **Sign-out Redirection:** Ensuring users are redirected to the Hero (landing) page immediately after signing out.
2.  **Command Auto-Normalization:** Enhancing the command creation flow to automatically handle the leading `/` (slash) character, reducing user friction.
3.  **Navbar User Menu:** Consolidation of user-related actions (Settings, Sign off, Terminate) into a cohesive dropdown menu within the navbar.

## Functional Requirements

### 1. Sign-out Redirection
- **Description:** When a user clicks "Sign off" or "Terminate", they must be logged out and redirected to the Hero screen (`/`).
- **Acceptance Criteria:**
  - Clicking logout triggers the `logoutSession` logic.
  - The browser navigates to `/` upon completion.
  - If the user was on a protected page (or any page with a navbar), they should see the Hero page content.

### 2. Command Auto-Normalization (Create Template)
- **Description:** In the "Create New Template" form, the "Trigger" input should automatically include or prepend a `/` if the user doesn't type it.
- **Example:** If the user types `hi1`, the value sent to the backend and stored should be `/hi1`.
- **Acceptance Criteria:**
  - The input field enforces a leading `/`.
  - The user doesn't have to manually type the `/`.
  - The request payload consistently includes the `/`.

### 3. Navbar User Menu
- **Description:** Clicking the user profile area (name/avatar) should toggle a dropdown menu.
- **Menu Options:**
  - **Settings:** Navigates to `/settings`.
  - **Sign off:** Triggers logout flow.
  - **Terminate:** Triggers logout flow (alternative label/styling).
- **Acceptance Criteria:**
  - Clicking the name or icon opens the menu.
  - Clicking outside or on an option closes the menu.
  - Options include appropriate icons.
  - Existing "Settings" button logic is merged into this menu.
  - Existing "TERMINATE" button is moved into this menu.

## User Stories
- **As a user**, I want to be taken back to the landing page when I sign out so I can see the app's introduction again.
- **As a user**, I want the app to handle technical prefixes (like `/`) automatically so I can focus on my command names.
- **As a user**, I want my account actions organized in one place in the navbar for a cleaner interface.
