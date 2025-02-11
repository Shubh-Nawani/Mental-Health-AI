export const logInfo = (message) => {
    console.log(`[INFO]: ${message}`);
  };
  
  export const logError = (message, error) => {
    console.error(`[ERROR]: ${message}`, error);
  };
  