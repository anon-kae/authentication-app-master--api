import { Request, Response } from 'express';
import * as morgan from 'morgan';
import Logger from '@/helpers/Logger';

const morganMessageFormatter = morgan.compile(
  ':method :url ▶ :status 💻 :user-agent (⌚ :response-time ms)',
);

const morganFormatter = (
  tokens: { [key: string]: any },
  req: Request,
  res: Response,
) => {
  const message = morganMessageFormatter(tokens, req, res);

  try {
    let requestUrl;

    try {
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      requestUrl = new URL(
        tokens.url(req, res),
        `${req.protocol}://${tokens.req(req, res, 'host')}`,
      );
    } catch (error) {
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      requestUrl = new URL(tokens.url(req, res), 'http://not.applicable');
    }

    let remoteIp = tokens['remote-addr'](req, res);

    if (tokens.req(req, res, 'x-forwarded-for')) {
      // this should be trusted only when using Google Cloud Load Balancer
      const forwardedIps = tokens.req(req, res, 'x-forwarded-for').split(',');
      if (forwardedIps.length >= 2) {
        forwardedIps.pop(); // remove last ip, it is the ip of the load balancer
        remoteIp = forwardedIps.pop();
      }
    }

    const httpRequest: { [key: string]: any } = {
      requestMethod: tokens.method(req, res),
      requestUrl,
      status: Number(tokens.status(req, res) || 0) || null,
      responseSize: tokens.res(req, res, 'content-length'),
      userAgent: tokens['user-agent'](req, res),
      remoteIp,
      serverIp: req.socket.localAddress,
      referer: tokens.referrer(req, res),
      protocol: req.protocol.toUpperCase(),
      latency: {},
    };

    const responseTime: number = Number(tokens['response-time'](req, res) || 0);

    if (responseTime) {
      httpRequest.latency = {
        seconds: Math.floor(responseTime / 1000),
        nanos: (responseTime % 1000) * 1000000,
      };
    }

    return JSON.stringify({ message, httpRequest });
  } catch (error) {
    // fallback to plain text formatter
    return JSON.stringify({ message });
  }
};

export default morgan(morganFormatter, {
  stream: { write: (message) => Logger.morgan(message) },
});
