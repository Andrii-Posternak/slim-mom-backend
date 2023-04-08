const calcDailyCalorieNorm = ({
  height,
  age,
  currentWeight,
  desiredWeight,
}) => {
  const calorieNorm =
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - desiredWeight);
  return Math.round(calorieNorm);
};

module.exports = calcDailyCalorieNorm;
