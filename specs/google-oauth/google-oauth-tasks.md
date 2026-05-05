# Google OAuth — Tasks

## T-1: Fix routing mismatch — add /login redirect route

**File:** `src/app/App.jsx`

Add a `NavigateWithQuery` helper component and a `/login` route inside `<Routes>` that redirects to `/auth` while preserving query params (`?error=oauth_failed`).

```jsx
// Helper (above AppContentInner)
function NavigateWithQuery({ to }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
}

// Inside <Routes>
<Route path="/login" element={<NavigateWithQuery to="/auth" />} />
```

**Acceptance:** Navigating to `/login?error=oauth_failed` redirects to `/auth?error=oauth_failed` without 404.

---

## T-2: Handle oauth error param in Auth.jsx useEffect

**File:** `src/features/auth/Auth.jsx`

In the existing `useEffect` that reads `location.search`, add detection for `?error=oauth_failed`:

```js
if (queryParams.get('error') === 'oauth_failed') {
  sileo.error({
    title: 'Google sign-in failed',
    description: 'Something went wrong with Google authentication. Please try again.',
    fill: '#ef4444',
  });
}
```

**Acceptance:** Landing on `/auth?error=oauth_failed` shows error toast. Does not interfere with `mode` param detection.

---

## T-3: Add Google button and divider to Auth.jsx

**File:** `src/features/auth/Auth.jsx`

1. Add `GOOGLE_OAUTH_URL` constant at module level:
   ```js
   const GOOGLE_OAUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/auth/google`;
   ```

2. Add handler:
   ```js
   const handleGoogleSignIn = () => {
     window.location.href = GOOGLE_OAUTH_URL;
   };
   ```

3. Add JSX after `auth-tabs` and before `auth-form` (only when `!isForgotPasswordMode && !isResetPasswordMode`):
   ```jsx
   <button type="button" className="btn-google" onClick={handleGoogleSignIn}>
     <GoogleIcon />
     Continue with Google
   </button>
   <div className="auth-divider">
     <span className="auth-divider-line" />
     <span className="auth-divider-text">or</span>
     <span className="auth-divider-line" />
   </div>
   ```

4. Add inline `GoogleIcon` SVG component (colored G mark).

**Acceptance:** Button visible in login/register modes. Clicking initiates redirect to Google. Absent in forgot/reset modes.

---

## T-4: Add Google button and divider CSS

**File:** `src/features/auth/Auth.css`

```css
.btn-google {
  width: 100%;
  height: 48px;
  background-color: var(--bg-inset);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
}

.btn-google:hover {
  border-color: var(--terminal-green);
  background-color: var(--bg-secondary);
  box-shadow: 0 0 0 1px var(--terminal-green);
}

.auth-divider {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.auth-divider-line {
  flex: 1;
  height: 1px;
  background-color: var(--border-subtle);
}

.auth-divider-text {
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  opacity: 0.5;
  text-transform: lowercase;
}
```

**Acceptance:** Button matches auth card visual language. Hover shows terminal-green border. Divider is quiet and unobtrusive.
