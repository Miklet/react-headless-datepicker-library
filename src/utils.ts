function range(
  length: number,
  mapper: (index: number) => number = index => index
): Array<number> {
  return Array.from({ length }, (_, index) => mapper(index));
}

export { range };
