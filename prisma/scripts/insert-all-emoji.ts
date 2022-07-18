import { PrismaClient } from '@prisma/client';
import data from '@emoji-mart/data';
import { inspect } from 'util';

const prisma = new PrismaClient({
  log: ['query', 'error', 'info', 'warn'],
});

// console.log(' emoji data: ', inspect(data.emojis['100']));

async function upsertEmoji(emoji) {
  const {
    id,
    name,
    skins: [{ unified, native }],
  } = emoji;
  const shortcodes = '';

  await prisma.emoji.upsert({
    create: {
      externalId: id,
      name,
      native,
      shortcodes,
      unified,
    },
    update: {},
    where: {
      unified,
    },
  });
}

async function main() {
  await Promise.all(
    Object.keys(data.emojis).map((key) => upsertEmoji(data.emojis[key]))
  );
}

main();
