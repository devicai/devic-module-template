export { ExtensionProperty, ModuleConfig } from '../config/config.types';

/**
 * The resolved scope from request headers based on configured extensions.
 * Keys are extension property names, values are the resolved header values.
 *
 * Example: { clientUID: 'abc-123', projectId: 'proj-1' }
 */
export type ExtensionScope = Record<string, string>;

/**
 * Standard paginated response shape for list endpoints.
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
