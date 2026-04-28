# Specification: Integrated Template Search

## Overview
Implement an integrated, real-time search functionality within the main terminal input of the Commander frontend. This allows users to filter their available templates as they type, providing a "fuzzy-find" experience similar to CLI tools like `fzf`.

## User Stories
- **As a user**, I want the template list to filter automatically as I type in the main input field, so I can find my templates quickly.
- **As a user**, I want to see visual feedback of how many templates match my current search query.
- **As a user**, I want to be able to search by command trigger (e.g., `/h1`), template name, or content keywords.
- **As a user**, I want the UI to remain terminal-themed and responsive, feeling like a high-performance developer tool.

## Functional Requirements
- **Real-time Filtering**: The `CommandList` should update immediately as the user modifies the `inputText`.
- **Dual-Mode Input**: 
    - If the input starts with `/`, it should prioritize matching against command triggers.
    - Otherwise, it should search across names and content.
- **Match Highlighting**: (Optional but desired) Highlight the matching part of the template name or trigger in the results.
- **Empty State**: Show a terminal-appropriate "No matches" message if the search yields no results.
- **Keyboard Navigation**: (Future enhancement) Support arrow keys to select from filtered results.

## Acceptance Criteria
- Typing in the input field updates the list of templates displayed below it.
- Clearing the input field restores the full list (or the recent commands view if no search was active).
- The search is case-insensitive.
- The UI maintains the "Terminal" aesthetic defined in `Home.jsx` and `Home.css`.
- Performance is smooth even with 50+ templates.
