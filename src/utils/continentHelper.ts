const continentMap: { [key: number]: string } = {
  1: "Europe",
  2: "Oceania",
  3: "North America",
  4: "Latin America",
  5: "Africa",
  6: "Asia",
  7: "Custom",
  8: "Custom2",
  9: "Custom3",
  10: "Custom4"
};

export const getContinentName = (continentNumber: number): string => {
  return continentMap[continentNumber] || "Unknown";
};
