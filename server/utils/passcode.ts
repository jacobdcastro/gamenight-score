function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export const getRandomUpper = () => String.fromCharCode(getRandomInt(26) + 65);

export const getRandomDigit = () => getRandomInt(10).toString();

const generatePasscode = () =>
  [...Array(4)]
    .map(() => {
      if (getRandomInt(2) === 0) return getRandomUpper();
      else return getRandomDigit();
    })
    .join('');

export default generatePasscode;
