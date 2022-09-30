
const rewards = [10, 20, 30, 40]; // [cherry, lemon, orange, watermelon]
const NUM_BLOCKS = 3;
export const CREDIT_PER_ROLL = 1;

const percentageChance = (percentage: number) => {
  return Math.random() < percentage / 100;
};

const doRoll = () => {
  const result = new Array(NUM_BLOCKS)
    .fill(0)
    .map(() => Math.floor(Math.random() * rewards.length)); // get random number between 0 and and length of rewards array (exclusive)
  const won = result.every((v, i, a) => v === a[0]); // if all are the same i.e. all are equal to the first element
  const reward = won ? rewards[result[0]] : 0;
  return { result, won, reward };
};

export const userRoll = (credit: number) => {
  let rollResult = doRoll(); //call actual roll func
  if (credit < 40 || !rollResult.won) { // if credit is less than 40 or if user didn't win, then return the roll result immediately
    return rollResult;
  }

  if (credit >= 40) {
    const chance = percentageChance(credit > 60 ? 60 : 30); // 60% chance if credit > 60, 30% chance if credit >= 40
    if (chance) {
      rollResult = doRoll(); //call actual roll func again
    }
  }
  return rollResult;
};

export const canPlay = (credit: number) => {
  return credit >= CREDIT_PER_ROLL;
};
