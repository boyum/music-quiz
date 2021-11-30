export const randomElement = <Type>(arr: Array<Type> | Readonly<Array<Type>>): Type => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
