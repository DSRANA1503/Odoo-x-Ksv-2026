export const calculateROI = (revenue: number, expenses: number) => {
  if (expenses === 0) return 100; // Fallback
  return ((revenue - expenses) / expenses) * 100;
};
