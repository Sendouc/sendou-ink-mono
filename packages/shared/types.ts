import { weapons } from ".";
import { stages } from "./constants/stages";

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export type Weapon = ElementType<typeof weapons>;
export type Stage = ElementType<typeof stages>;

export type RankedMode = "SZ" | "TC" | "RM" | "CB";
