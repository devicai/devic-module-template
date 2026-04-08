import { Outlet } from 'react-router';
import { theme } from 'antd';
import Sidebar from './Sidebar/Sidebar';

/**
 * Main layout — matches the Devic frontend structure exactly.
 *
 * Layout:
 *   - Horizontal flex, full viewport
 *   - Sidebar: 15% min 250px
 *   - Content panel: flex 1, scroll contained
 *   - Outer padding: 5px, gap: 5px
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
        backgroundColor: '#141414',
      }}
    >
      {/* Sidebar — width 15% min 250px */}
      <div style={{ width: '15%', minWidth: 250, flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Main content panel */}
      <main
        style={{
          flex: 1,
          backgroundColor: token.colorBgContainer,
          borderRadius: 8,
          padding: 10,
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
