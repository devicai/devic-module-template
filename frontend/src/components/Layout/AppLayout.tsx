import { Outlet } from 'react-router';
import { theme } from 'antd';
import Sidebar from './Sidebar/Sidebar';

/**
 * Main layout — matches the Devic frontend structure.
 *
 * Layout: horizontal flex, sidebar + content panel.
 * - Sidebar: 15% min 250px (expanded) / 60px (collapsed, not implemented in template)
 * - Content: fills remaining space, scroll contained
 * - Full viewport height
 */
function AppLayout() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        padding: 5,
        gap: 5,
        backgroundColor: token.colorBgLayout,
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          backgroundColor: token.colorBgContainer,
          borderRadius: 8,
          padding: 10,
          overflowY: 'auto',
          border: `1px solid ${token.colorBorder}`,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
