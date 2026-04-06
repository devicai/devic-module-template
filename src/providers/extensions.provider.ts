import { Schema } from 'mongoose';
import { ExtensionProperty } from '../config/config.types';

export const EXTENSIONS_TOKEN = Symbol('EXTENSIONS');

const TYPE_MAP: Record<string, unknown> = {
  string: String,
  number: Number,
  boolean: Boolean,
  date: Date,
};

/**
 * Applies extension properties to a Mongoose schema.
 * Must be called BEFORE the schema is compiled into a model.
 *
 * @param schema - The Mongoose schema to extend
 * @param entityName - The name of the entity (used to match against extension config)
 * @param extensions - The list of configured extension properties
 */
export function applyExtensions(
  schema: Schema,
  entityName: string,
  extensions: ExtensionProperty[],
): void {
  for (const ext of extensions) {
    const applies =
      ext.entities === '*' ||
      (Array.isArray(ext.entities) && ext.entities.includes(entityName));

    if (!applies) continue;

    schema.add({
      [ext.name]: {
        type: TYPE_MAP[ext.type] ?? String,
        required: ext.required ?? false,
        index: ext.index ?? false,
      },
    });
  }
}
