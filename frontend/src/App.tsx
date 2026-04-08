import { ConfigProvider, theme } from 'antd';
import { Routes, Route } from 'react-router';
import AppLayout from './components/Layout/AppLayout';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';

/**
 * Theme tokens — shared with the Devic frontend design system.
 *
 * Primary color: #4661B1 (Devic default)
 * Text color:    #b3b3b3 (dark) / #3F3F46 (light)
 */
const THEME_TOKENS = {
  colorPrimary: '#4661B1',
  colorInfo: '#4661B1',
  colorText: '#b3b3b3',
};

function App() {
  // Dark mode is the default. Extend with a toggle via context if needed.
  const isDark = true;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: THEME_TOKENS,
        components: {
          Card: {
            bodyPadding: 10,
          },
          Button: {
            colorPrimaryBorderHover: THEME_TOKENS.colorPrimary,
            defaultHoverBorderColor: THEME_TOKENS.colorPrimary,
          },
        },
      }}
    >
      <div
        data-theme={isDark ? 'dark' : 'light'}
        style={
          {
            '--theme-primary-color': THEME_TOKENS.colorPrimary,
            '--theme-info-color': THEME_TOKENS.colorInfo,
            '--theme-text-color': THEME_TOKENS.colorText,
            '--theme-info-shadow': 'rgba(70, 97, 177, 0.2)',
            height: '100%',
          } as React.CSSProperties
        }
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </ConfigProvider>
  );
}

export default App;
