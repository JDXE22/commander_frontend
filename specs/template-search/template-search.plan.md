# Technical Plan: Integrated Template Search

## Overview
Implement a real-time, debounced search functionality in the `FilterCmd` (Management) view.

## Proposed Architecture

### API Layer (`apiCommands.js`)
- Add `searchCommands(query)` function.
- Target endpoint: `${URL}/search?query=${query}`.

### State Management (`FilterCmd.jsx`)
- `searchQuery`: Track the user's current input.
- `searchResults`: Store the results returned from the API.
- `isSearching`: Loading state for search operations.
- `isSearchActive`: Boolean to toggle between standard paginated view and search result view.

### Component Logic
- **Debouncing**: Use a `useEffect` with a `setTimeout` (e.g., 300ms) to trigger search requests after the user stops typing.
- **Toggle View**:
    - If `searchQuery` is empty, show the regular paginated list.
    - If `searchQuery` is present, show the `searchResults`.

## Interface Design Specifications
- **Intent**: High-efficiency template management for power users.
- **Palette**: 
    - `--terminal-bg`: #0a0a0a
    - `--terminal-green`: #00ff41
    - `--terminal-border`: #1a1a1a
- **Surfaces**: 
    - Search input should have a `background: rgba(255, 255, 255, 0.03)` and a thin `1px solid var(--terminal-border)` to look "inset".
- **Signature**: The search input prefix will be a dynamic prompt `SEARCH >`.
- **Typography**: Monospace for the search input and results.

## Performance Considerations
- Use debouncing to prevent excessive API calls.
- Clear search results when the query is cleared to free up memory.
