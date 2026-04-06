export interface ModuleConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  storage?: StorageConfig;
  extensions: ExtensionsConfig;
  auth: AuthConfig;
  webhooks?: WebhooksConfig;
  logging: LoggingConfig;
}

export interface ServerConfig {
  port: number;
  basePath: string;
  cors?: {
    enabled: boolean;
    origins: string[];
  };
}

export interface DatabaseConfig {
  provider: 'mongodb' | 'postgres';
  uri?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

export interface StorageConfig {
  provider: 'local' | 's3' | 'gcs';
  localPath?: string;
  maxFileSize?: string;
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface ExtensionsConfig {
  properties: ExtensionProperty[];
}

export interface ExtensionProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
  index: boolean;
  entities: string[] | '*';
  source: 'header';
  headerName: string;
}

export interface AuthConfig {
  enabled: boolean;
  strategy: 'api-key' | 'jwt' | 'none';
  apiKeys?: Array<{
    name: string;
    key: string;
  }>;
}

export interface WebhooksConfig {
  events: Record<string, string>;
  headers?: Record<string, string>;
  retries?: number;
  timeoutMs?: number;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'pretty';
}
