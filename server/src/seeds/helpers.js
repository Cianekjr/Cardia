export const getRandomArg = arr => arr[Math.floor(Math.random() * arr.length)]
export const getMixString = arr => arr.sort(() => Math.random() - 0.5).join(' ')
export const getRandomInt = (minValue, maxValue) => {
  const min = Math.ceil(minValue);
  const max = Math.floor(maxValue);
  return Math.floor(Math.random() * (max - min) + min);
}
