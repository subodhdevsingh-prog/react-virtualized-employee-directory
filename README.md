# Employee Directory — Virtualized Table & Role-Based Access

A small React 18 + TypeScript app that renders a directory of 10,000 employees in a
virtualized table, with debounced search, department filtering, generic sorting,
role-based UI, XSS-safe rendering, and a live FPS meter.

## Stack

- React 18 + Vite 5
- TypeScript in strict mode (zero `any`)
- Zustand for typed global state (persisted to `sessionStorage`)
- `@tanstack/react-virtual` for row virtualization
- TailwindCSS for styling

## Setup

```bash
npm install
npm run dev      # start the dev server (Vite prints the local URL)
npm run build    # type-check (tsc --noEmit) then production build
npm run preview  # preview the production build
```

There are no required environment variables. See [`.env.example`](.env.example) for the
Vite env pattern if you want to add one.

## Demo guide

Use the role switcher in the header to change the active role and watch the UI adapt:

| Role    | Salary column        | Edit button |
| ------- | -------------------- | ----------- |
| admin   | Real amounts (`₹…`)  | Visible     |
| manager | Masked (`₹ ••••••`)  | Visible     |
| viewer  | Masked (`₹ ••••••`)  | Hidden      |

The selected role is remembered while the tab is open and resets when the tab closes.

## Architecture decisions

- **Virtualization over pagination.** `@tanstack/react-virtual` mounts only the rows
  near the viewport (plus a small overscan), so the DOM holds a few dozen rows instead
  of 10,000. See [`src/components/Table/VirtualTable.tsx`](src/components/Table/VirtualTable.tsx).
- **Compound `Table` component.** [`src/components/Table/index.ts`](src/components/Table/index.ts)
  exposes `Table.Virtual`, `Table.Header`, and `Table.Row` so the table can be used whole
  or composed piece by piece.
- **Generic hooks.** [`useSortableData<T>`](src/hooks/useSortableData.ts) and
  [`useDebounce<T>`](src/hooks/useDebounce.ts) are fully generic and reusable beyond this app.
- **Zustand over Redux.** A single typed store
  ([`src/store/authStore.ts`](src/store/authStore.ts)) holds auth state with no reducers,
  actions, or providers — much less boilerplate for global state this small.
- **Render performance.** `TableRow` is wrapped in `React.memo`, and all sort/filter
  handlers are stabilized with `useCallback`, so scrolling does not re-render untouched
  rows. The data pipeline (filter then sort) is memoized with `useMemo`.

## Security notes

- **XSS-safe text.** Every user-facing string is passed through
  [`sanitizeDisplayString`](src/utils/sanitize.ts), which strips HTML tags before the
  value is rendered as a plain React text node.
- **No `dangerouslySetInnerHTML`.** The app never injects raw HTML anywhere.
- **Role guarding removes, not hides.** [`RoleGuard`](src/components/Auth/RoleGuard.tsx)
  keeps disallowed content out of the rendered tree rather than hiding it with CSS.
- **Session-scoped state.** The auth store persists to `sessionStorage`, so it clears
  when the tab is closed and is never written to `localStorage`.
- **CSP-friendly styling.** Layout uses static Tailwind classes. The only inline styles
  are virtualizer-derived geometry (`height` / `transform`) computed from trusted
  numbers, never from user input. `index.html` ships a sample CSP meta tag.
- **Typed logger.** [`src/utils/logger.ts`](src/utils/logger.ts) is the single place that
  touches `console`, and it is a no-op in production builds.

> Note: `sessionStorage`-based roles are a UI demonstration of role-based rendering, not a
> real authorization mechanism. Production access control must be enforced server-side.

## Project structure

```
src/
  components/
    Table/
      VirtualTable.tsx   virtualized rows
      TableHeader.tsx    sortable, role-aware header
      TableRow.tsx       memoized row
      columns.ts         shared column defs + grid template
      index.ts           compound Table export
    Auth/
      RoleGuard.tsx      role-based render guard
    RoleSwitcher.tsx     header role dropdown
    FpsCounter.tsx       requestAnimationFrame FPS meter
  hooks/
    useSortableData.ts   generic sort hook <T>
    useDebounce.ts       generic debounce hook <T>
  store/
    authStore.ts         Zustand typed store (sessionStorage)
  data/
    generateEmployees.ts deterministic 10k mock dataset
  types/
    employee.types.ts
    auth.types.ts
  utils/
    sanitize.ts          XSS-safe string helpers
    format.ts            currency formatting
    logger.ts            typed, prod-safe logger
  App.tsx
  main.tsx
```
