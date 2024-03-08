export const isTokenExpired = (token: string) => {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    if (!decodedToken) {
      return true;
    }

    if (decodedToken.exp && typeof decodedToken.exp === "number") {
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const fiveMinutesInSeconds = 5 * 60;
      const fiveMinutesFromNow =
        currentTimestampInSeconds + fiveMinutesInSeconds;
      return decodedToken.exp < fiveMinutesFromNow;
    }

    return true;
  } catch (error) {
    return true;
  }
};
