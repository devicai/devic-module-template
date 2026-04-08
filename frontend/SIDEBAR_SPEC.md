# Sidebar Specification

This document defines the **exact** components and behaviors of the Devic sidebar. Every Devic OS module frontend must implement this specification without deviation.

Source of truth: `devic-ai/frontend/suntropy-ai-frontend/src/components/Layout/Sidebar/`

---

## 1. Structure Overview

The sidebar is a single vertical flex column with three regions:

```
┌──────────────────────────────┐
│ Header                       │  height: 30px, marginBottom: 20px, marginTop: 10px
├──────────────────────────────┤
│ Scrollable area              │  flexGrow: 1, overflowY: auto
│   ├ Search input             │  padding: 0 12px 8px
│   ├ ModuleMenu               │  ← THE ONLY variable region
│   └ (dividers between menus) │
├──────────────────────────────┤
│ Footer                       │  height: 60px, padding: 4px, flexShrink: 0
└──────────────────────────────┘
```

**Container styles (root div):**
```ts
{
  height: "100%",
  width: "100%",
  backgroundColor: "#1f1f1f",   // light mode: #FAFAFA
  position: "relative",
  userSelect: "none",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
}
```

---

## 2. Header (30px)

**Height:** `30px` fixed, `minHeight: 30px`, `flexShrink: 0`, `marginBottom: 20px`.

**Contents:**
- **Logo** (left, absolute positioned): `top: 10px, left: 10px, height: 30px`, clickable → navigates to `/`.
- **Action icon** (right, absolute positioned): `top: 12px, right: 15px`.
  - Icon: `faPenToSquare` from `@fortawesome/free-solid-svg-icons`
  - Style: `fontSize: 18, color: "#d9d9d9"` (dark) / `"#8c8c8c"` (light)
  - Wrapped in `<Tooltip>` (e.g. "Start new chat", "New document")
  - Class: `"hover-opacity clickable"`

**Header container styles:**
```ts
{
  height: 30,
  minHeight: 30,
  flexShrink: 0,
  cursor: "pointer",
  position: "relative",
  marginBottom: 20,
}
```

---

## 3. Search Input

**Placed inside the scrollable area**, at the very top, with `padding: "0 12px 8px"`.

**Component:** Ant Design `<Input size="small">` with:
```tsx
<Input
  placeholder="Search..."
  prefix={<FontAwesomeIcon icon={faSearch} style={{ color: "#8c8c8c", fontSize: 12 }} />}
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  allowClear
  size="small"
  style={{
    backgroundColor: "rgba(255,255,255,0.06)",  // dark
    borderColor: "rgba(255,255,255,0.1)",        // dark
    borderRadius: 6,
  }}
/>
```

`searchText` is owned by the parent `Sidebar` component and passed down to each menu as a prop.

---

## 4. Module Menus — Core Pattern

**This is the heart of the sidebar.** Every Devic menu component (`SidebarAssistantsMenu`, `SidebarAgentsMenu`, `SidebarKnowledgeMenu`, `SidebarTablesMenu`, `SidebarToolsMenu`, `SidebarConversationsMenu`) follows the exact same pattern.

### 4.1. Each menu = ONE Ant Design `<Menu>` with ONE root item

```tsx
<Menu
  items={[
    {
      key: "knowledge",                    // the root key
      icon: <FontAwesomeIcon icon={faBook} style={{ fontSize: 16, color: textColor }} />,
      label: (
        <span
          style={{ color: textColor, fontWeight: 500 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/documents");        // clicking the label navigates to the module's base path
          }}
        >
          Knowledge
        </span>
      ),
      children: childItems,                // the subsections
    },
  ]}
  style={{ width: "100%", border: "none", backgroundColor: "transparent" }}
  selectedKeys={selectedKeys}              // computed from location.pathname
  inlineIndent={15}
  mode="inline"
  defaultOpenKeys={defaultOpenKeys.length ? defaultOpenKeys : undefined}
/>
```

**Mandatory properties:**
- `mode="inline"`
- `inlineIndent={15}`
- `border: "none"`, `backgroundColor: "transparent"`
- Root icon: **16px**
- Root label: `color: "#B3B3B3"` (dark) / `"#3F3F46"` (light), `fontWeight: 500`
- Root label has `onClick={(e) => { e.stopPropagation(); navigate(basePath); }}` so clicking the label (but not the expand chevron) navigates.

### 4.2. Child items

Children are `MenuItem[]`. They come in three flavors:

**A. Static children** (like `SidebarKnowledgeMenu`):
```tsx
const childItems: MenuItem[] = [
  {
    key: "knowledge-documents",
    icon: <FontAwesomeIcon icon={faFileLines} style={{ fontSize: 13, color: subtleColor }} />,
    label: "Documents",
    onClick: () => navigate("/documents"),
  },
  {
    key: "knowledge-skills",
    icon: <FontAwesomeIcon icon={faBolt} style={{ fontSize: 13, color: subtleColor }} />,
    label: (
      <span style={{ color: subtleColor }}>
        Skills <span style={{ fontSize: 11, fontStyle: "italic" }}>(coming soon)</span>
      </span>
    ),
    disabled: true,
  },
];
```

- Child icon: **13px**, color `subtleColor` (`#8c8c8c` dark / `#a1a1aa` light)
- Disabled items have the label wrapped in a `<span style={{ color: subtleColor }}>` with an optional italic `(coming soon)` suffix.

**B. Dynamic children** (like `SidebarAssistantsMenu`, `SidebarAgentsMenu`): fetched from API, filtered by `searchText`, optionally grouped by project.

**C. Nested subcategories** (like `SidebarToolsMenu`): the root has children that are themselves expandable with `fontWeight: 500, fontSize: 13`:
```tsx
{
  key: "toolsCustom",
  label: <span style={{ fontWeight: 500, fontSize: 13 }}>Custom MCPs</span>,
  children: customChildren,
}
```

### 4.3. Search filtering

When `searchText` is non-empty, filter the children:
```tsx
const normalizedSearch = (searchText || "").toLowerCase().trim();
const childItems = normalizedSearch
  ? allChildItems.filter((item: any) => {
      const label = typeof item.label === "string" ? item.label : "fallback text";
      return label.toLowerCase().includes(normalizedSearch)
        || "rootName".includes(normalizedSearch);
    })
  : allChildItems;
```

The root always renders. If no children match, the section still shows but collapsed/empty.

### 4.4. `selectedKeys` computation

Always computed from `location.pathname`, never stored in state:
```tsx
const selectedKeys = (() => {
  if (location.pathname.startsWith("/documents")) return ["knowledge-documents"];
  if (location.pathname.startsWith("/skills")) return ["knowledge-skills"];
  return [];
})();
```

Pattern:
- If path matches a child subsection → `[childKey]`
- If path matches the root but no specific child → `[rootKey]`
- Otherwise → `[]`

### 4.5. `defaultOpenKeys`

Controlled by the `defaultExpandedKeys?: SidebarExpandedKey[]` prop passed down from the parent `Sidebar`. Each menu filters to its own allowed keys:
```tsx
const allowedKeys = ["knowledge"];
const defaultOpenKeys = (defaultExpandedKeys || []).filter((k) => allowedKeys.includes(k));
```

### 4.6. Pagination: "X more"

For menus that can grow large (Tools, Agents), cap each list at `MAX_ITEMS_PER_CATEGORY = 5` and add a "N more" link:
```tsx
const italicStyle = { fontStyle: "italic", fontSize: 12, color: "#8c8c8c" };

mapped.push({
  key: `${categoryKey}-more`,
  label: <span style={italicStyle}>{remaining} more</span>,
  onClick: () => navigate("/tools"),
});
```

### 4.7. Loading states

When fetching children, show a single loading item:
```tsx
{
  key: "tools-loading",
  label: <span style={italicStyle}>Loading tools...</span>,
}
```

Or disable the whole menu with `<Menu disabled={isLoading} expandIcon={null}>`.

### 4.8. Empty states

When a subcategory has no items, show a single italic item that navigates to the module base:
```tsx
{
  key: "toolsCustom-empty",
  label: <span style={italicStyle}>No custom MCPs</span>,
  onClick: () => navigate("/tools"),
}
```

### 4.9. Project grouping (advanced, only when the module has multi-project support)

When no project is selected (`currentProject == null`), group items by project:
```tsx
{
  key: `tools-project-${projectId}`,
  label: (
    <span style={{ fontWeight: 500, fontSize: 13, display: "inline-flex", alignItems: "center" }}>
      {projectImageUrl && (
        <img src={projectImageUrl} alt={projectName}
             style={{ width: 18, height: 18, borderRadius: "50%", marginRight: 8, flexShrink: 0 }} />
      )}
      {projectName}
    </span>
  ),
  children: [...],
}
```

Items without a project appear at the top level (outside any group).

---

## 5. Menu Composition in Sidebar.tsx

Inside the scrollable area of `Sidebar.tsx`, menus are rendered in order with `<Divider className="my-1">` between them:

```tsx
<div style={{ flexGrow: 1, position: "relative", overflowY: "auto" }}>
  <div style={{ padding: "0 12px 8px" }}>
    <Input ... />
  </div>

  {!options?.hideAssistants && (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <SidebarAssistantsMenu searchText={searchText} ... />
      </div>
      <Divider className="my-1" />
    </>
  )}

  {!options?.hideAgents && (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <SidebarAgentsMenu searchText={searchText} ... />
      </div>
      <Divider className="my-1" />
    </>
  )}

  {/* Knowledge is always shown — no toggle */}
  <div className="d-flex justify-content-center align-items-center">
    <SidebarKnowledgeMenu searchText={searchText} ... />
  </div>
  <Divider className="my-1" />

  {/* ... more menus ... */}
</div>
```

**Rule for module templates:** the module ships with a single menu component (`SidebarModuleMenu`) and **no hide toggles** — there's only one section.

---

## 6. Footer (60px)

**Component:** `SidebarFooter.tsx`

**Container:** 60px height, `flexShrink: 0`, `padding: 4px`, `zIndex: 9`.

**Internal structure:**
```tsx
<div style={{ width: "100%", cursor: "pointer", backgroundColor: "#1f1f1f" }}>
  <Popover placement="right" arrow={false} content={<FooterPopoverContent />}>
    <Card style={{ width: "100%", backgroundColor: "transparent", padding: 0, borderRadius: 8 }}>
      <Meta
        avatar={
          <Avatar src={user.imageUrl}>
            {user.name.split(" ").map(w => w[0]?.toUpperCase()).slice(0, 2).join("")}
          </Avatar>
        }
        style={{ fontSize: 12 }}
        description={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ flex: 1, marginRight: 8, overflow: "hidden" }}>
              <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user.name}
              </div>
              <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <FontAwesomeIcon icon={faAngleUp} />
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </div>
        }
      />
    </Card>
  </Popover>
</div>
```

### 6.1. Footer popover content

Ant Design `<Menu>` with these items in order:
1. **Profile header** (disabled, custom label) — avatar + name + email, lineHeight 1.2
2. **Divider**
3. **Settings** — `faGear` icon, navigates to `/configuration` (admin only in Devic; always visible in modules)
4. **Usage** (admin only, optional for modules) — `faChartLine`
5. **Public API** (admin only, optional) — `faCode`
6. **Documentation** — `faBook`, opens `https://docs.devic.ai` in new tab
7. **Log Out** — `faArrowRightFromBracket`, clears session and navigates to login

```tsx
<Menu style={{ width: 200, border: "none", padding: 0 }} selectedKeys={[]}>
  {/* items... */}
</Menu>
```

---

## 7. Collapsed Mode (50px icon-only with hover-to-expand)

**When** `collapsed={true}` prop is passed to the Sidebar:

- Width: **50px**
- Background: `#1f1f1f` / `#FAFAFA`, `borderRadius: 8px`
- Layout: column, `alignItems: center`, `paddingTop: 12, paddingBottom: 12, gap: 4`

**Contents:**
1. **Logo** (32×32, cropped): clickable, navigates to `/`
2. **Menu icons** (40×40 each):
   - Each icon inside a `<Tooltip placement="right">`
   - Icons from the same FontAwesome set, 16px, color `#d9d9d9` / `#595959`
   - Active state: `backgroundColor: "rgba(255,255,255,0.1)"` (dark) / `"rgba(0,0,0,0.06)"` (light)
   - Hover state: `"rgba(255,255,255,0.05)"` / `"rgba(0,0,0,0.03)"`
   - Border radius: 6px
3. **User avatar** (bottom, 40×40): Popover on click with profile menu (same content as expanded footer)

**Hover-to-expand overlay:**
- Rendered via `createPortal` to escape stacking contexts
- `position: "fixed", top: 5, left: 5, bottom: 5`
- Width animates from 50px → 250px on hover: `transition: "width 0.2s ease-out, box-shadow 0.2s ease-out, opacity 0.15s ease-out"`
- Box shadow when expanded: `"4px 0 16px rgba(0,0,0,0.25)"`
- `zIndex: 99999`
- `pointerEvents: isHovered ? "auto" : "none"`
- When expanded, renders the full Sidebar (`<Sidebar collapsed={false}>`) inside

---

## 8. Color Tokens (must be used exactly)

| Token | Dark | Light |
|-------|------|-------|
| Sidebar background | `#1f1f1f` | `#FAFAFA` |
| Root text (menu label) | `#B3B3B3` | `#3F3F46` |
| Subtle text (child labels, placeholders) | `#8c8c8c` | `#a1a1aa` |
| Icon color (root) | `#B3B3B3` | `#3F3F46` |
| Icon color (child) | `#8c8c8c` | `#a1a1aa` |
| Icon color (header action) | `#d9d9d9` | `#8c8c8c` |
| Search bg | `rgba(255,255,255,0.06)` | `#fff` |
| Search border | `rgba(255,255,255,0.1)` | `#d9d9d9` |
| Hover bg | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.06)` |
| Hover bg (subtle) | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.03)` |

---

## 9. Required Files for a Module Template

```
frontend/src/components/Layout/Sidebar/
├── Sidebar.tsx              # Root container: header + search + menus + footer
├── Sidebar.types.ts         # SidebarExpandedKey union type
├── SidebarModuleMenu.tsx    # THE module menu (single root + children) — THE ONLY CUSTOM PART
├── SidebarFooter.tsx        # Copy-paste from Devic, wire up your auth/user context
└── moduleConfig.ts          # Module metadata: name, icon, basePath, sections[]
```

**What the module author writes:** only `moduleConfig.ts` (metadata) and possibly extends `SidebarModuleMenu.tsx` if it needs dynamic data fetching.

**What stays identical across all modules:** `Sidebar.tsx`, `SidebarFooter.tsx`, and the menu rendering pattern inside `SidebarModuleMenu.tsx`.

---

## 10. What a Module Must NOT Do

- ❌ Add multiple top-level menu sections (Assistants + Agents + X...). A module has **one** root section.
- ❌ Replace the header, search, or footer with custom components.
- ❌ Use different icon sizes, colors, or fontweights than specified.
- ❌ Store `selectedKeys` or `openKeys` in component state — always derive from `location.pathname` and props.
- ❌ Split the sidebar into two panels (e.g., folders panel + nav). Use the content area for folder trees.
- ❌ Put Settings in the main nav. Settings go in the footer popover, always.
- ❌ Use emojis or custom SVGs in place of FontAwesome icons.
- ❌ Change `inlineIndent={15}` or the root/child icon sizes (16px / 13px).

---

## 11. Reference Files in Devic

These are the canonical implementations. When in doubt, copy from here:

- `devic-ai/frontend/suntropy-ai-frontend/src/components/Layout/Sidebar/Sidebar.tsx` — root container
- `devic-ai/frontend/suntropy-ai-frontend/src/components/Layout/Sidebar/SidebarKnowledgeMenu.tsx` — simplest menu (static children), best starting point for most modules
- `devic-ai/frontend/suntropy-ai-frontend/src/components/Layout/Sidebar/SidebarToolsMenu.tsx` — menu with nested subcategories + pagination
- `devic-ai/frontend/suntropy-ai-frontend/src/components/Layout/Sidebar/SidebarAssistantsMenu.tsx` — dynamic menu with API fetching + project grouping
- `devic-ai/frontend/suntropy-ai-frontend/src/components/Layout/Sidebar/SidebarFooter.tsx` — footer with user popover
