import { type MapFunction } from '@xstd/functional';

export interface EntityPropertyMapper<GIn, GOut> {
  readonly to: MapFunction<GIn, GOut>;
  readonly from: MapFunction<GOut, GIn>;
}
