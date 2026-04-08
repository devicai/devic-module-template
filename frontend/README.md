# Frontend — Devic Module Design System

This is the **official frontend scaffold** for Devic open-source modules. It replicates the look, feel, and conventions of the main Devic frontend so all modules share a consistent user experience.

---

## Tech Stack

| Layer | Choice | Version |
|-------|--------|---------|
| UI library | React | 19.x |
| Build tool | Vite | 6.x |
| Language | TypeScript | 5.7+ (strict: false, matches Devic) |
| Component library | Ant Design | 5.24+ |
| Icons | FontAwesome (free) | 6.7+ |
| Router | React Router | 7.x |
| Font | Geist (fallback: Inter, system-ui) | 1.7+ |

**Do not** switch to Tailwind, styled-components, or other component libraries. Consistency across modules matters more than individual preferences.

---

## Getting Started

```bash
cd frontend
yarn install
yarn dev    # starts dev server on http://localhost:5173
```

The frontend expects the module backend to be running on `http://localhost:3100`.

---

## Design Tokens

These are the exact color values used across all Devic modules. Do not invent new ones — extend this list via a PR if a new use case emerges.

### Colors (dark mode — default)

| Token | Hex | Usage |
|-------|-----|-------|
| `colorPrimary` | `#4661B1` | Primary actions, active states, links, accents |
| `colorInfo` | `#4661B1` | Info states, same as primary |
| `colorBgLayout` | `#141414` | Page background |
| `colorBgContainer` | `#1f1f1f` | Cards, sidebar, modals |
| `colorBgElevated` | `#2f2f2f` | Elevated surfaces, inputs, table headers |
| `colorBorder` | `#424242` | Borders, dividers |
| `colorText` | `#b3b3b3` | Primary text |
| `colorTextSecondary` | `#9e9e9e` | Secondary text, descriptions |
| `colorTextTertiary` | `#555555` | Muted text, placeholders |
| `colorSuccess` | `#52c41a` | Success states |
| `colorWarning` | `#faad14` | Warning states |
| `colorError` | `#ff4d4f` | Error states, destructive actions |

### Colors (light mode)

| Token | Hex |
|-------|-----|
| `colorBgLayout` | `#ffffff` |
| `colorBgContainer` | `#FAFAFA` |
| `colorBorder` | `#f0f0f0` |
| `colorText` | `#3F3F46` |

Dark mode is **the default**. Light mode is supported but not the primary experience.

### Typography

- **Font family**: `Geist, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`
- **Base size**: `12px` (set on `html`/`body`)
- **Heading sizes**: use Ant Design `<Typography.Title>` with `level={1-5}`
- **Weights**: 400 (regular), 600 (bold)

### Spacing scale

Stick to multiples of 4:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps, icon-to-text |
| sm | 8px | Default padding |
| md | 12px | Card internal padding |
| lg | 16px | Section gaps |
| xl | 20px | Large margins |
| 2xl | 40px | Page sections |

### Border radius

- Small (inputs, buttons): `6px`
- Medium (cards, sidebar, modals): `8px`

### Transitions

- Fast (hover states): `0.2s ease-out`
- Standard (opacity, color): `0.3s ease-in-out`
- Layout (drawers, collapses): `300ms ease-out`

---

## Layout

Every Devic module **must** use the same layout structure:

```
┌──────────────────────────────────────────────────────┐
│  Optional top banner (warnings, announcements)        │
├───────────┬──────────────────────────────────────────┤
│           │                                           │
│  Sidebar  │          Main Content Panel              │
│  (15%     │          (flex: 1, scroll contained)     │
│  min      │                                           │
│  250px)   │                                           │
│           │                                           │
└───────────┴──────────────────────────────────────────┘
```

### Dimensions

- **Sidebar expanded**: `15%` of viewport, minimum `250px`
- **Sidebar collapsed** (if implemented): `60px`, icon-only with hover-to-expand
- **Main content**: fills remaining space
- **Outer padding**: `5px`
- **Inner content padding**: `10px`
- **Border radius**: `8px` on panels

### Sidebar structure (MANDATORY)

Every Devic OS module **must** use the exact same sidebar structure as the Devic main frontend. This ensures a seamless experience when the module is integrated into Devic — the module's section simply "plugs in" alongside Devic's other sections.

```
┌────────────────────────────┐
│  [Logo]            [Edit]  │  30px header, marginBottom 20px
├────────────────────────────┤
│  🔍 Search...              │  Input, size: small
├────────────────────────────┤
│                            │
│  📖 Module Name       ▼    │  ← SINGLE expandable root
│     📄 Section 1           │
│     📁 Section 2           │  Inline menu, children
│     🔎 Section 3           │
│                            │
│                            │
├────────────────────────────┤
│  👤 User Name       ▲▼     │  60px footer with popover
│     user@email.com         │
└────────────────────────────┘
```

**Rules:**

1. **Header** (30px height): Module logo/icon on the left (absolute, top: 10px, left: 10px), action icon on the right (e.g. "New document", "New chat"). Margin-bottom 20px.
2. **Search input**: size="small", transparent background, subtle border, magnifying glass prefix icon.
3. **Module menu**: Exactly **ONE** top-level expandable section — the module itself. All features of the module go as **children subsections**. This is critical for integration: when the module plugs into Devic, its root section sits alongside Devic's own (Assistants, Agents, Knowledge, etc).
4. **Footer** (60px height): User avatar + name + email, wrapped in a Popover that reveals Settings / Documentation / Log Out menu.

**Background:** `#1f1f1f` dark. **Border radius:** `8px`.

**Configuration:** edit `src/components/Layout/Sidebar/moduleConfig.ts` to set your module name, icon, base path, and sections. Do **not** add multiple top-level sections — keep everything under the single root.

**Do NOT:**
- Split the sidebar into two panels (folders panel + main nav). Use the main content area for folder trees.
- Add multiple top-level menu sections. Use one root + children.
- Change the header, search, or footer structure. Only the module menu section varies.
- Add a "settings" item in the main nav. Settings always live in the footer popover.

---

## Component Conventions

### Buttons

Use Ant Design `<Button>` with these variants:

| Variant | Usage |
|---------|-------|
| `type="primary"` | Main action on a view (one per context, ideally) |
| `type="default"` | Secondary actions |
| `type="text"` | Icon buttons, inline actions, minimal emphasis |
| `type="link"` | Navigational or "see more" actions |
| `type="dashed"` | "Add new" affordances |
| `danger` prop | Destructive actions (delete, remove) |

**Icon buttons**: always wrap in a `<Tooltip>` with a descriptive label.

```tsx
<Tooltip title="Delete">
  <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} />
</Tooltip>
```

**Loading state**: use `loading={isLoading}` for async actions. Disable instead when the action is not applicable.

### Icons

Always use **FontAwesome free (solid preferred)** via `@fortawesome/react-fontawesome`:

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faHome} style={{ fontSize: 14, width: 16 }} />
```

- Sidebar icons: `14px`, fixed `width: 16` for alignment
- Inline text icons: `12-14px`
- Card/header icons: `16-18px`
- Do **not** use Ant Design icons except when no FontAwesome equivalent exists.

### Tooltips vs Modals vs Popovers vs Notifications

Choosing the right UI for user feedback/interaction:

| Use case | Component | Why |
|----------|-----------|-----|
| Hover hint on icon button | `<Tooltip>` | Non-blocking, brief text, accessibility |
| Keyboard shortcut display | `<Tooltip>` | Consistent with global convention |
| Quick inline form (1–3 fields) | `<Popover>` | Contextual, doesn't interrupt flow |
| Complex form or multi-step | `<Modal>` | Focused attention, blocking user flow |
| Confirmation of destructive action | `<Modal.confirm>` or `<Popconfirm>` | Intentional friction |
| Async result feedback (saved, error) | `notification.success()` / `notification.error()` | Auto-dismiss, non-intrusive |
| Critical blocking error | `<Modal>` with `type="error"` | Requires acknowledgment |
| Transient status (loading, progress) | `message.loading()` | Minimal footprint |

**Rule of thumb**:
- If the user needs to **read** something: tooltip (brief) or notification (actionable)
- If the user needs to **do** something: popover (simple) or modal (complex)
- Never use a modal when a popover or tooltip would suffice

### Cards

Default style — use Ant Design `<Card>`:

```tsx
<Card
  title="Section Title"
  extra={<Button type="primary" size="small">Action</Button>}
  styles={{ body: { padding: 10 } }}  // global default already set
>
  Content
</Card>
```

- **Body padding**: `10px` (set globally in `App.tsx` via ConfigProvider)
- **Hover border** (if interactive): `2px solid colorPrimary`, transition `0.1s`
- **Border radius**: `8px`

### Forms

Use Ant Design `<Form layout="vertical">` with `<Form.Item>`:

```tsx
<Form layout="vertical">
  <Form.Item label="Name" name="name" rules={[{ required: true }]}>
    <Input placeholder="Enter name" />
  </Form.Item>
</Form>
```

- Vertical layout by default (better for dark mode, more scannable)
- Labels always present (no placeholder-as-label)
- Validation messages via Ant Design `rules`
- Primary submit button at the bottom

### Tables

Use Ant Design `<Table>` with `columns` array. Prefer:

- Sortable columns via `sorter`
- Pagination via `pagination={{ pageSize: 20 }}`
- Row hover state (automatic via theme)
- **Tags for status**: `<Tag color="success|blue|orange|red|default">Label</Tag>`

### Typography

```tsx
import { Typography } from 'antd';
const { Title, Paragraph, Text } = Typography;

<Title level={4}>Page title</Title>        // Max level={4} for in-page headers
<Paragraph type="secondary">Description</Paragraph>
<Text strong>Important</Text>
<Text type="secondary">Muted</Text>
```

Reserve `level={1-3}` for external landing pages if any. In-app views use `level={4}` or `level={5}`.

---

## File Structure

```
frontend/
├── src/
│   ├── main.tsx                      # Entry point
│   ├── App.tsx                       # ConfigProvider + routes
│   ├── index.css                     # Global styles, font, scrollbar
│   ├── styles/
│   │   └── dark-theme.css            # Ant Design dark overrides
│   ├── components/
│   │   └── Layout/
│   │       ├── AppLayout.tsx         # Sidebar + content layout
│   │       └── Sidebar/
│   │           └── Sidebar.tsx       # Navigation sidebar
│   ├── pages/
│   │   ├── HomePage.tsx              # Example page
│   │   └── SettingsPage.tsx          # Example form page
│   ├── context/                      # React Context providers
│   └── hooks/                        # Custom hooks
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.node.json
```

---

## State Management

**Use React Context API**. No Redux, no Zustand, no MobX. This matches the Devic frontend convention and keeps the bar low for contributors.

Place context providers in `src/context/` — one file per context. Pattern:

```tsx
// src/context/ModuleContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface ModuleContextValue {
  loading: boolean;
  setLoading: (v: boolean) => void;
}

const ModuleContext = createContext<ModuleContextValue | null>(null);

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <ModuleContext.Provider value={{ loading, setLoading }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const ctx = useContext(ModuleContext);
  if (!ctx) throw new Error('useModule must be used within ModuleProvider');
  return ctx;
}
```

---

## Integration with the Module Backend

The frontend calls the module's own backend API (the one scaffolded in `src/` at the repo root). Use the `x-*` headers defined in the backend's `config.yml` extensions when multi-tenancy is configured.

```tsx
// Example fetch with extension headers
const response = await fetch(`${API_URL}/documents`, {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'x-client-uid': clientUid,
    'x-project-id': projectId,
  },
});
```

For modules integrated into Devic, these headers are added automatically by the SuntropyAI wrapper. For standalone use, the frontend must provide them itself or omit them if extensions are not configured.

---

## Checklist: Ready for Review

Before opening a PR with frontend changes:

- [ ] No hardcoded colors — always use `theme.useToken()` or CSS variables
- [ ] All icons are FontAwesome (no inline SVGs or emoji)
- [ ] Icon buttons have tooltips
- [ ] Forms use vertical layout with `<Form.Item>` labels
- [ ] Destructive actions use `danger` prop or `Popconfirm`
- [ ] Async actions show loading state
- [ ] Dark mode is the default and looks correct
- [ ] No new dependencies without justification
- [ ] Responsive at minimum 1280×800 (desktop-first)
