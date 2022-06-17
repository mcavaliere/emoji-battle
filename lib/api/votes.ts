import { Emoji, Round } from '@prisma/client';
import type EmojiGetPayload from '@prisma/client';

/**
 * Upsert an emoji into the database, and record a vote for it.
 */
export async function create(
  roundId: Round['id'],
  emoji: typeof EmojiGetPayload
): Promise<Emoji> {
  const response = await fetch('/api/votes/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ roundId, emoji }),
  });

  if (!response.ok) {
    console.warn('Error creating emoji: ', response.statusText);
  }

  return await response.json();
}
