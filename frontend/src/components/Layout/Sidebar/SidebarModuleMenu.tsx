import { Menu, MenuProps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router';
import { MODULE_CONFIG } from './moduleConfig';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
  searchText?: string;
  defaultExpanded?: boolean;
}

/**
 * Module menu — renders the module as a SINGLE top-level section with its
 * subsections as children. This matches the pattern of Devic's sidebar menus
 * (SidebarKnowledgeMenu, SidebarAgentsMenu, etc).
 *
 * Style notes:
 *   - Root item icon: 16px, strong text color, fontWeight 500
 *   - Child item icon: 13px, subtle text color
 *   - inlineIndent: 15
 *   - No border, transparent background
 */
export function SidebarModuleMenu({ searchText, defaultExpanded = true }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const textColor = '#B3B3B3';
  const subtleColor = '#8c8c8c';
  const normalizedSearch = (searchText || '').toLowerCase().trim();

  const allChildItems: MenuItem[] = MODULE_CONFIG.sections.map((section) => ({
    key: `${MODULE_CONFIG.name.toLowerCase()}-${section.key}`,
    icon: (
      <FontAwesomeIcon
        icon={section.icon}
        style={{ fontSize: 13, color: subtleColor }}
      />
    ),
    label: section.disabled ? (
      <span style={{ color: subtleColor }}>
        {section.label}{' '}
        <span style={{ fontSize: 11, fontStyle: 'italic' }}>(coming soon)</span>
      </span>
    ) : (
      section.label
    ),
    disabled: section.disabled,
    onClick: section.disabled ? undefined : () => navigate(section.path),
  }));

  // Filter children by search text
  const childItems = normalizedSearch
    ? allChildItems.filter((item: any) => {
        const label =
          typeof item.label === 'string'
            ? item.label
            : MODULE_CONFIG.sections.map((s) => s.label).join(' ');
        return (
          label.toLowerCase().includes(normalizedSearch) ||
          MODULE_CONFIG.name.toLowerCase().includes(normalizedSearch)
        );
      })
    : allChildItems;

  const rootKey = MODULE_CONFIG.name.toLowerCase();

  const items: MenuItem[] = [
    {
      key: rootKey,
      icon: (
        <FontAwesomeIcon
          icon={MODULE_CONFIG.icon}
          style={{ fontSize: 16, color: textColor }}
        />
      ),
      label: (
        <span
          style={{ color: textColor, fontWeight: 500 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(MODULE_CONFIG.basePath);
          }}
        >
          {MODULE_CONFIG.name}
        </span>
      ),
      children: childItems,
    },
  ];

  // Compute which child is selected based on current path
  const selectedKeys = (() => {
    for (const section of MODULE_CONFIG.sections) {
      if (location.pathname.startsWith(section.path) && section.path !== '/') {
        return [`${rootKey}-${section.key}`];
      }
    }
    return [];
  })();

  return (
    <Menu
      items={items}
      style={{
        width: '100%',
        border: 'none',
        backgroundColor: 'transparent',
      }}
      selectedKeys={selectedKeys}
      inlineIndent={15}
      mode="inline"
      defaultOpenKeys={defaultExpanded ? [rootKey] : undefined}
    />
  );
}
