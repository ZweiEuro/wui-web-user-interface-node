import { myPackage, myPackage2 } from '../src';

describe('index', () => {
  describe('myPackage', () => {
    it('should return a string containing the message', () => {
      const message = 'Hello';

      const result = myPackage(message);

      expect(result).toMatch(message);
    });
  });

  describe('otherfunk', () => {
    it('should return a string containing the message', () => {
      const message = 'Hello';

      const result = myPackage2(message);

      expect(result).toMatch(message);
    });
  });
});
