/**
 * General functions
 */
export const getValue = (name, options) => {
  const option = options.find((option) => option.name === name);
  return option?.value ?? null;
};
