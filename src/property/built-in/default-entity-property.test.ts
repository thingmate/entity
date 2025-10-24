import { describe, expect, test } from 'vitest';
import { DEFAULT_ENTITY_PROPERTY } from './default-entity-property.js';

describe('DEFAULT_ENTITY_PROPERTY', () => {
  test('get should reject', async () => {
    await expect(DEFAULT_ENTITY_PROPERTY.get()).rejects.toThrow();
  });

  test('set should reject', async () => {
    await expect(DEFAULT_ENTITY_PROPERTY.set(1)).rejects.toThrow();
  });

  test('observer should reject', async () => {
    await expect(
      DEFAULT_ENTITY_PROPERTY.observer.open(new AbortController().signal).next(),
    ).rejects.toThrow();
  });
});
