const continentMap: { [key: number]: string } = {
  1: "Europe",
  2: "Oceania",
  3: "North America",
  4: "South America",
  5: "Africa",
  6: "Asia",
  7: "Custom",
};

export const getContinentName = (continentNumber: number): string => {
  return continentMap[continentNumber] || "Unknown";
};
