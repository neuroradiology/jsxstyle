import { Properties } from 'csstype';

/** Make all properties in T potentially falsey */
export type Falsey<T> = { [P in keyof T]?: T[P] | false | null };

/**
 * jsxstyle-compatible CSS properties provided by csstype.
 *
 * Use this type instead of `CSSProperties` if you don't use pseudoelement, pseudoclass, or media query props with jsxstyle.
 */
export interface ExactCSSProperties
  extends Falsey<Properties<string | number>> {}

/**
 * jsxstyle-compatible CSS properties provided by csstype with an additional string index signature.
 *
 * Use this type instead of `ExactCSSProperties` if you use pseudoelement, pseudoclass, or media query props with jsxstyle.
 */
export interface CSSProperties
  extends ExactCSSProperties,
    Record<string, any> {}
