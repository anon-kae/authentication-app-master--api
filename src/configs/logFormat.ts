import * as colors from 'colors/safe';
import * as winston from 'winston';

export default winston.format.combine(
  winston.format.timestamp(),
  winston.format.simple(),
);

export const json = winston.format.combine(
  winston.format.timestamp(),
  winston.format.uncolorize(),
  winston.format.json(),
);

const useColor = (
  color: Function,
  value: number | string | winston.Logform.TransformableInfo,
): string => {
  return color(value);
};

export const plain = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf((message) => {
    const requestId = message.requestId || '<--- no request --->';
    const userId = message.userId !== -1 ? message.userId : '---';
    const timestamp = message.timestamp;

    const colorGay = useColor(colors.gray, requestId);
    const colorYellow = useColor(colors.yellow, userId);
    const colorBlue = useColor(colors.blue, message.action);

    // handle error object
    if (message.stack) {
      return `${timestamp} > 🆔 ${colorGay} | 👤 ${colorYellow} [${colorBlue}] ${message.level}: ${message.stack}`;
    }

    // handle error from logger
    if (message.error && message.error.stack) {
      return `${timestamp} > 🆔 ${colorGay} | 👤 ${colorYellow} [${colorBlue}] ${message.level}: ${message.error.stack}`;
    }

    return `${timestamp} > 🆔 ${colorGay} | 👤 ${colorYellow} [${colorBlue}] ${message.level}: ${message.message}`;
  }),
);
