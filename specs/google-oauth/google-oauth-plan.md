# Google OAuth — Technical Plan

## Architecture Overview

The backend already implements the full OAuth flow:
- `GET /api/v2/auth/google` — generates state, sets httpOnly cookie, redirects to Google
- `GET /api/v2/auth/google/callback` — validates state, exchanges code for profile, creates/links user, issues refresh token cookie, redirects to `FRONTEND_URL`
- On error: redirects to `FRONTEND_URL/login?error=oauth_failed`

The frontend only needs to:
1. Trigger the redirect to the backend OAuth endpoint
2. Handle session restoration after callback (already handled by `AuthContext`)
3. Handle the error redirect route mismatch

---

## Session Restoration Flow

```
User clicks Google button
  → window.location.href = BACKEND_URL/auth/google
  → Google OAuth flow (external)
  → Backend sets __rt httpOnly cookie, redirects to FRONTEND_URL (/)
  → React mounts, AuthProvider runs initializeAuth()
  → refreshSession() called → POST /auth/refresh with cookie
  → Access token received, user set in state
  → isAuthenticated = true → Navigate to /terminal
```

No extra session handling needed — `AuthContext` already covers this.

---

## Error Redirect Fix

Backend redirects to `FRONTEND_URL/login?error=oauth_failed` on failure.
Frontend has no `/login` route — this causes a blank/404 page.

**Fix:** Add a `<Route path="/login">` in `App.jsx` that renders a `<Navigate>` to `/auth` preserving query params.

```jsx
// In App.jsx Routes
<Route path="/login" element={<NavigateWithQuery to="/auth" />} />
```

Where `NavigateWithQuery` is a small inline component using `useLocation` to preserve search params.

---

## Frontend Changes

### 1. `App.jsx`
- Add `/login` catch route that redirects to `/auth` with same query string

### 2. `Auth.jsx`
- Add `useEffect` to detect `?error=oauth_failed` in URL → show sileo error toast
- Add `handleGoogleSignIn` function: `window.location.href = GOOGLE_OAUTH_URL`
- Compute `GOOGLE_OAUTH_URL` from env vars: `${VITE_API_BASE_URL}/${VITE_API_VERSION}/auth/google`
- Render Google button + OR divider only when `!isForgotPasswordMode && !isResetPasswordMode`
- Placement: after auth tabs, before email form (social-first pattern)

### 3. `Auth.css`
- `.btn-google` — full-width, 48px height, bg-inset background, border-subtle border, rounded 10px
- `.btn-google:hover` — terminal-green border, subtle glow
- `.auth-divider` — flex row with lines + "or" text
- `.auth-divider-line` — flex:1, 1px border-subtle
- `.auth-divider-text` — text-secondary, small, monospace

---

## Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Button placement | Above email form | Social-first pattern reduces friction |
| Button style | Dark (bg-inset) + border | Consistent with terminal aesthetic; no white card break |
| Google logo | Colored SVG G mark | Brand recognition without deviating from dark theme |
| Divider text | "or" in mono font | Matches Commander's terminal language |
| Error toast | sileo.error() | Consistent with all other auth error handling |
| No API wrapper | Direct window.location.href | OAuth is a browser redirect, not an API call |

---

## Environment Variables

Existing vars used — no new env vars needed:
- `VITE_API_BASE_URL` — already used in `apiClient.js`
- `VITE_API_VERSION` — already used in `apiClient.js`

Google OAuth URL constructed at component level:
```js
const GOOGLE_OAUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/auth/google`;
```

---

## No Backend Changes

Backend is complete. All routes, state management, user creation/linking, and token issuance are already implemented in `authController.js`.
