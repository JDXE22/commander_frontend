# Tasks: Integrated Template Search

## Phase 1: API Implementation
- [ ] Add `searchCommands` to `frontend/src/features/commands/api/apiCommands.js`.
    - Function signature: `searchCommands({ query, limit = 10 })`
    - Method: `GET`
    - Path: `/search`

## Phase 2: UI Skeleton & Styles
- [ ] Update `frontend/src/features/commands/dashboard/FilterCmd.css` with new styles:
    - `.search-bar-wrapper`: Container for the prompt and input.
    - `.search-prompt`: `SEARCH >` styling.
    - `.search-input-field`: Inset terminal styling.
    - Loading animation for search.

## Phase 3: Component Logic
- [ ] Implement search state in `FilterCmd.jsx`.
- [ ] Add the search input field to the JSX.
- [ ] Implement debounced search effect using `useEffect`.
- [ ] Logic to switch between `persistentCommands` and `searchResults`.
- [ ] Handle "No results found" for search.

## Phase 4: Refinement
- [ ] Add smooth transitions using `framer-motion` (if already available/used).
- [ ] Ensure focus states and accessibility (aria-labels).
- [ ] Test with empty queries and rapid typing.
