# Google OAuth — Specification

## Overview

Allow users to authenticate with Commander using their Google account. This provides a faster sign-in path that avoids email/password friction and integrates with an existing backend Google OAuth implementation.

---

## Business Requirements

- Users can sign in or register using Google on the `/auth` page
- Both login and register modes show the Google option
- Forgot password and reset password modes do NOT show the Google option (irrelevant flows)
- On successful Google authentication, users land on `/terminal` (same as email/password login)
- On OAuth failure, users see an error message on the auth page and can retry

---

## User Stories

**US-1 — Sign in with Google (existing account)**
As a returning user with a Google-linked account,
I want to click "Continue with Google" and be authenticated instantly,
So that I don't have to type my email and password.

**US-2 — Sign up with Google (new account)**
As a new user,
I want to sign up using my Google account,
So that I can start using Commander without creating a password.

**US-3 — Google OAuth error recovery**
As a user whose Google authentication failed,
I want to see a clear error message on the auth page,
So that I understand what went wrong and can try again.

**US-4 — Existing email account links Google**
As a user who registered with email/password but logs in with Google (same email),
My accounts are automatically linked by the backend.
The frontend has no special handling needed for this case.

---

## Functional Requirements

| ID   | Requirement |
|------|-------------|
| FR-1 | Display "Continue with Google" button in login and register auth modes |
| FR-2 | Google button initiates full-page redirect to backend `/auth/google` endpoint |
| FR-3 | After successful OAuth, `AuthContext.refreshSession()` restores session from httpOnly cookie |
| FR-4 | Backend error redirects to `/login?error=oauth_failed` — frontend must handle this route and display error |
| FR-5 | Error toast uses existing sileo notification system |
| FR-6 | Google button excluded from forgot password and reset password modes |

---

## Acceptance Criteria

- [ ] Clicking "Continue with Google" redirects the browser to the backend OAuth endpoint
- [ ] Successful Google sign-in lands user on `/terminal` with authenticated session
- [ ] Failed OAuth shows sileo error toast: "Google sign-in failed" with retry option
- [ ] `/login?error=oauth_failed` route does not 404 — redirects to `/auth` with error param
- [ ] Google button is absent in forgot password and reset password modes
- [ ] No regressions to existing email/password login, register, forgot password, or reset password flows

---

## Out of Scope

- Backend changes (Google OAuth already fully implemented)
- Additional OAuth providers (GitHub, etc.)
- Unlinking Google from an account
- Showing which provider an account uses in settings
