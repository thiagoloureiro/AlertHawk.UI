import { IMonitor } from "../interfaces/IMonitor";
import { faker } from "@faker-js/faker";

const generateRandomMonitorData = (count: number): IMonitor[] => {
  const monitors: IMonitor[] = [];

  for (let i = 0; i < count; i++) {
    const monitor: IMonitor = {
      id: faker.number.int(),
      monitorTypeId: faker.number.int(),
      name: faker.lorem.words(),
      heartBeatInterval: faker.number.int(),
      retries: faker.number.int({ min: 0, max: 3 }),
      status: faker.datatype.boolean(),
      daysToExpireCert: faker.number.int(),
      paused: faker.datatype.boolean(),
      monitorRegion: faker.number.int(),
      monitorEnvironment: faker.number.int(),
      monitorStatusDashboard: {
        monitorId: faker.number.int(),
        uptime1Hr: faker.number.int({ min: 80, max: 100 }),
        uptime24Hrs: faker.number.int({ min: 80, max: 100 }),
        uptime7Days: faker.number.int({ min: 80, max: 100 }),
        uptime30Days: faker.number.int({ min: 80, max: 100 }),
        uptime3Months: faker.number.int({ min: 80, max: 100 }),
        uptime6Months: faker.number.int({ min: 80, max: 100 }),
        certExpDays: faker.number.int({ min: 80, max: 250 }),
        responseTime: faker.number.int(),
      },
    };

    monitors.push(monitor);
  }

  return monitors;
};

const generateRandomData = {
  generateRandomMonitorData,
};

export default generateRandomData;
