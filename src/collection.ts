/**
 * Utility for lists to ensure there are no empty values.
 *
 * @example
 * ```ts
 * const products = [
 * {id: 'a', price: {centAmount: 20}},
 * {id: 'b', price: null},
 * {id: 'c', price: {centAmount: 30}}
 * ]
 * products.map(x => price).filter(isValue).map(p => p.centAmount)
 *
 * // results in
 * [20, 30]
 * ```
 */
export const isValue = <T>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined;
