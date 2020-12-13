function interpolate(value: string, values: object) {
  return Object.entries(values).reduce(
    (interpolatedValue, currentKeyValuePair) => {
      const replaceRegexp = new RegExp(`{{${currentKeyValuePair[0]}}}`);

      return interpolatedValue.replace(replaceRegexp, currentKeyValuePair[1]);
    },
    value
  );
}

export { interpolate };
