const splitGenotype = (genotype) => genotype.split("");

const computePunnettSquare = (parent1, parent2) => {
  const alleles1 = splitGenotype(parent1);
  const alleles2 = splitGenotype(parent2);
  const counts = {};

  for (let a1 of alleles1) {
    for (let a2 of alleles2) {
      const child = [a1, a2].sort().join("");
      counts[child] = (counts[child] || 0) + 1;
    }
  }

  const total = alleles1.length * alleles2.length;
  const percentages = {};
  for (const key in counts) {
    percentages[key] = (counts[key] / total) * 100;
  }

  return percentages;
};

const generateRiskMessage = (percentages) => {
  if (percentages["SS"])
    return "Significant risk of sickle cell disease in offspring";
  if (percentages["AS"])
    return "25% chance of SS offspring with each pregnancy";
  return "Offspring healthy. No risk of sickle cell disease.";
};
export { computePunnettSquare, generateRiskMessage };
