/**
 * Conditiionally instantiates PrismaClient on-demand or globally depending on
 *  whether we're in a local or deployed(serverless) environment.
 *
 * https://github.com/prisma/prisma/issues/5007#issuecomment-618433162
 */
import { PrismaClient } from '@prisma/client';

let prisma;

const options: any = {};

if (process.env.DEBUG && process.env.DEBUG === 'true') {
  options.log = ['query', 'error', 'info', 'warn'];
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(options);
} else {
  console.log(`---------------- not prod.  `);

  // @ts-ignore
  if (typeof global['prisma'] === 'undefined') {
    console.log(`---------------- global prisma DNE, creating `);
    // @ts-ignore
    global['prisma'] = new PrismaClient(options);
  } else {
    console.log(`---------------- global prisma exists.  `);
  }

  // @ts-ignore
  prisma = global['prisma'];
}

export default prisma;
