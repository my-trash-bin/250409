import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../internal-types";
import {
  Directive,
  OperationDefinition,
  OperationType,
  SelectionSet,
  VariableDefinition,
} from "../../../types";
import { ExpectDirectives } from "../../ExpectDirectives";
import { ExpectName } from "../../ExpectName";
import { ExpectVariableDefinitions } from "../ExpectVariableDefinitions";
import { ExpectSelectionSet } from "./ExpectSelectionSet";

export type ExpectOperationDefinition<S extends string> = S extends `{${string}`
  ? AfterDirectives<S, "query", undefined, undefined, undefined>
  : ExpectName<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer OT extends OperationType;
      rest: infer A extends string;
    }
    ? ExpectName<A> extends infer I
      ? I extends {
          type: "ok";
          value: infer Name extends string;
          rest: infer B extends string;
        }
        ? AfterName<B, OT, Name>
        : AfterName<A, OT, undefined>
      : never
    : Ensure<
        { type: "error"; error: "Expected { or OperationType" },
        ExpectResultError
      >
  : never;

type AfterName<
  S extends string,
  OT extends OperationType,
  Name extends string | undefined
> = S extends `(${string}`
  ? ExpectVariableDefinitions<S> extends infer I
    ? I extends {
        type: "ok";
        value: infer Variables extends VariableDefinition[];
        rest: infer A extends string;
      }
      ? AfterVariables<A, OT, Name, Variables>
      : I
    : never
  : AfterVariables<S, OT, Name, undefined>;

type AfterVariables<
  S extends string,
  OT extends OperationType,
  Name extends string | undefined,
  Variables extends VariableDefinition[] | undefined
> = ExpectDirectives<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Directives extends Directive[];
      rest: infer A extends string;
    }
    ? AfterDirectives<A, OT, Name, Variables, Directives>
    : I
  : never;

type AfterDirectives<
  S extends string,
  OT extends OperationType,
  Name extends string | undefined,
  Variables extends VariableDefinition[] | undefined,
  Directives extends Directive[] | undefined
> = ExpectSelectionSet<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer SS extends SelectionSet;
      rest: infer A extends string;
    }
    ? Ensure<
        {
          type: "ok";
          value: {
            type: "executable";
            subType: "operation";
            operationType: OT;
            name: Name;
            variableDefinitions: Variables;
            directives: Directives;
            selectionSet: SS;
          };
          rest: A;
        },
        ExpectResultOk<OperationDefinition>
      >
    : I
  : never;
