import moment from "moment";

const info = (message: any) => {
  if (typeof message === "string") {
    console.log(`[${getDate()}] [INFO] ${message}`);
  } else {
    console.log(`[${getDate()}] [INFO]`, message);
  }
};

const warn = (message: any) => {
  if (typeof message === "string") {
    console.warn(`[${getDate()}] [WARN] ${message}`);
  } else {
    console.warn(`[${getDate()}] [WARN]`, message);
  }
};

const error = (message: any) => {
  if (typeof message === "string") {
    // Use console.error instead of console.log for errors
    console.error(`[${getDate()}] [ERROR] ${message}`);
  } else {
    console.error(`[${getDate()}] [ERROR]`, message);
  }
};

const getDate = () => {
  return moment().format("DD-MM-YYYY HH:m:s");
};

const logging = {
  info,
  warn,
  error,
};

export default logging;
