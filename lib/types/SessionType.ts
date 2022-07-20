import { Awaitable, Session, User } from 'next-auth';

export type SessionUserType = User;

export type SessionType = Session & { user: User };
