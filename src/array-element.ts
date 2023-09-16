// This is a utility that extracts the inner type from an array type
// In other words, `ArrayElement<Categories>` produces the type of single Category.
// https://stackoverflow.com/a/51399781
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
