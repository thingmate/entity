import { type Flow, type PushToPullOptions } from '@xstd/flow';

export type ObserveEntityPropertyFlow<GValue> = Flow<GValue, [options?: PushToPullOptions]>;
