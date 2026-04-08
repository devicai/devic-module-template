import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Input, Tooltip, theme, Typography, Divider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faGear,
  faSearch,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

const { Text } = Typography;

interface NavItem {
  key: string;
  label: string;
  icon: typeof faHome;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', icon: faHome, path: '/' },
  { key: 'docs', label: 'Documentation', icon: faBook, path: '/docs' },
];

const FOOTER_ITEMS: NavItem[] = [
  { key: 'settings', label: 'Settings', icon: faGear, path: '/settings' },
];

/**
 * Sidebar — matches the Devic frontend sidebar.
 *
 * Structure:
 *   - Logo header (30-60px)
 *   - Search input
 *   - Main nav (grows to fill)
 *   - Footer (shrink: 0)
 *
 * Width: 15% min 250px
 * Background: #1f1f1f (dark) / #FAFAFA (light)
 * Border radius: 8px
 */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const [search, setSearch] = useState('');

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const renderItem = (item: NavItem) => {
    const active = isActive(item.path);
    return (
      <Tooltip key={item.key} title={item.label} placement="right">
        <div
          onClick={() => navigate(item.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            color: active ? token.colorPrimary : token.colorText,
            backgroundColor: active ? 'rgba(70, 97, 177, 0.1)' : 'transparent',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!active) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <FontAwesomeIcon icon={item.icon} style={{ fontSize: 14, width: 16 }} />
          <Text style={{ color: 'inherit', fontSize: 13 }}>{item.label}</Text>
        </div>
      </Tooltip>
    );
  };

  return (
    <aside
      style={{
        width: '15%',
        minWidth: 250,
        backgroundColor: token.colorBgContainer,
        borderRadius: 8,
        border: `1px solid ${token.colorBorder}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo / Header */}
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: `1px solid ${token.colorBorder}`,
          flexShrink: 0,
        }}
      >
        <Text strong style={{ fontSize: 14, color: token.colorText }}>
          Devic Module
        </Text>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 12px 8px' }}>
        <Input
          size="small"
          prefix={<FontAwesomeIcon icon={faSearch} style={{ fontSize: 11 }} />}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Main navigation */}
      <nav
        style={{
          flex: 1,
          padding: '4px 8px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {NAV_ITEMS.map(renderItem)}
      </nav>

      <Divider style={{ margin: 0 }} />

      {/* Footer */}
      <div
        style={{
          padding: '8px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {FOOTER_ITEMS.map(renderItem)}
      </div>
    </aside>
  );
}

export default Sidebar;
