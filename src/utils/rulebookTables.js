export const getFamilyCharacteristicIndexFromRoll = (roll) => {
  const r = Math.min(20, Math.max(1, parseInt(roll, 10) || 1));
  if (r <= 2) return 0;
  if (r === 3) return 1;
  if (r === 4) return 2;
  if (r <= 6) return 3;
  if (r <= 8) return 4;
  if (r <= 10) return 5;
  if (r === 11) return 6;
  if (r === 12) return 7;
  if (r === 13) return 8;
  if (r === 14) return 9;
  if (r === 15) return 10;
  if (r === 16) return 11;
  if (r === 17) return 12;
  if (r === 18) return 13;
  if (r === 19) return 14;
  return 15;
};
