import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBook,
  faFileLines,
  faMagnifyingGlass,
  faFolder,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Module configuration — edit this file to customize your module.
 *
 * Every Devic OS module must follow this convention:
 *   - ONE top-level menu section (the module itself)
 *   - All features go as children/subsections of that section
 *
 * This ensures that when the module is integrated into Devic,
 * it appears as just another section of the main sidebar (alongside
 * Assistants, Agents, Knowledge, etc) in a consistent way.
 */

export interface ModuleSubSection {
  /** Unique key for this subsection */
  key: string;
  /** Display label */
  label: string;
  /** FontAwesome icon */
  icon: IconDefinition;
  /** Navigation path */
  path: string;
  /** Optional: disable the item (e.g. "coming soon") */
  disabled?: boolean;
}

export interface ModuleConfig {
  /** Module display name — shown as the root menu item label */
  name: string;
  /** Module root icon (FontAwesome) */
  icon: IconDefinition;
  /** Base path of the module's main feature — clicked when the root label is clicked */
  basePath: string;
  /** All subsections (features) of the module */
  sections: ModuleSubSection[];
}

/**
 * Default module configuration — REPLACE with your module's details.
 * Example below corresponds to a "Knowledge" module.
 */
export const MODULE_CONFIG: ModuleConfig = {
  name: 'Knowledge',
  icon: faBook,
  basePath: '/documents',
  sections: [
    {
      key: 'documents',
      label: 'Documents',
      icon: faFileLines,
      path: '/documents',
    },
    {
      key: 'folders',
      label: 'Folders',
      icon: faFolder,
      path: '/folders',
    },
    {
      key: 'search',
      label: 'Search',
      icon: faMagnifyingGlass,
      path: '/search',
    },
  ],
};
