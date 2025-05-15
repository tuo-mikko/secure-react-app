// Main security logger
// Writes auth related events for up to a week, logins, token refreshes, posts etc.
// Logs also into the console
import winston from 'winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/sec-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [transport, new winston.transports.Console()],
});

export default logger;