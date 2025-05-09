import { Ensure } from "@this-project/util-types-common";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../internal-types";
import { InputFieldsDefinition, InputValueDefinition } from "../../../types";
import { ExpectInputValueDefinition } from "./ExpectInputValueDefinition";

export type ExpectInputFieldsDefinition<
  S extends string,
  On extends string
> = S extends `{${infer A}`
  ? ExpectInputValueDefinition<TrimStart<A>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Argument extends InputValueDefinition;
        rest: infer B extends string;
      }
      ? Internal<B, [Argument], On>
      : I
    : never
  : Ensure<{ type: "error"; error: "Expected {"; on: On }, ExpectResultError>;

type Internal<
  S extends string,
  R extends InputValueDefinition[],
  On extends string
> = S extends `}${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<InputFieldsDefinition>
    >
  : ExpectInputValueDefinition<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer Argument extends InputValueDefinition;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Argument], On>
    : I
  : never;
