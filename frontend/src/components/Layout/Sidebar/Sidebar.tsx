import { useState } from 'react';
import { Input, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { SidebarModuleMenu } from './SidebarModuleMenu';
import { SidebarFooter } from './SidebarFooter';
import { MODULE_CONFIG } from './moduleConfig';

/**
 * Sidebar — matches Devic's Sidebar structure exactly.
 *
 * Structure:
 *   - Header (30px) with logo on left + action icon on right, marginBottom 20px
 *   - Search input
 *   - Module menu (single root section with children subsections)
 *   - Footer (60px) with user popover
 *
 * When integrated into Devic, the module's single root section appears
 * alongside Devic's other sections (Assistants, Agents, Knowledge, etc),
 * providing a seamless experience.
 */
export function Sidebar() {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleHeaderAction = () => {
    // Customize this per module — e.g. "Create new document", "New chat", etc.
    navigate(MODULE_CONFIG.basePath);
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#1f1f1f',
        position: 'relative',
        userSelect: 'none',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* --- Header with logo + action icon --- */}
      <div
        style={{
          height: 30,
          minHeight: 30,
          flexShrink: 0,
          position: 'relative',
          marginBottom: 20,
          marginTop: 10,
        }}
      >
        {/* Logo (module icon + name as placeholder for branding) */}
        <div
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: 0,
            left: 12,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          {/* Replace this div with an <img src="/logo.svg" /> for your module */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #4661B1 0%, #6652b2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {MODULE_CONFIG.name[0]}
          </div>
        </div>

        {/* Action icon on the right (e.g. new document, new chat) */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 15,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <Tooltip title={`New ${MODULE_CONFIG.name.toLowerCase()}`}>
            <FontAwesomeIcon
              icon={faPenToSquare}
              onClick={handleHeaderAction}
              style={{
                fontSize: 18,
                color: '#d9d9d9',
                cursor: 'pointer',
              }}
              className="hover-opacity clickable"
            />
          </Tooltip>
        </div>
      </div>

      {/* --- Scrollable area: search + menus --- */}
      <div
        style={{
          flexGrow: 1,
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        {/* Search input */}
        <div style={{ padding: '0 12px 8px' }}>
          <Input
            placeholder="Search..."
            prefix={
              <FontAwesomeIcon
                icon={faSearch}
                style={{ color: '#8c8c8c', fontSize: 12 }}
              />
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="small"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 6,
            }}
          />
        </div>

        {/* Module menu — ONE root section with children */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SidebarModuleMenu searchText={searchText} defaultExpanded />
        </div>
      </div>

      {/* --- Footer with user info --- */}
      <div
        style={{
          width: '100%',
          height: 60,
          flexShrink: 0,
          zIndex: 9,
          padding: 4,
        }}
      >
        <SidebarFooter />
      </div>
    </div>
  );
}

export default Sidebar;
