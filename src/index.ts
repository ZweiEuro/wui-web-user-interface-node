export const myPackage = (taco = ''): string => `${taco} from my package`;

export const myPackage2 = (taco = ''): string => {
  console.log('Awdawd');
  return `${taco} from my package 2`;
};
