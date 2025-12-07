import { type Action } from '@xstd/action';

export type WriteEntityPropertyAction<GValue> = Action<[value: GValue], void>;
