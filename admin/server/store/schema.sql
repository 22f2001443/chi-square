-- The admin's tables in Neon. `npm run db:setup` applies this file; every
-- statement is safe to run again.

-- People who may sign in, by lowercase GitHub login. Owners listed in
-- ADMIN_OWNERS are always owners and need no row here.
create table if not exists admin_members (
  login text primary key,
  role text not null check (role in ('owner', 'editor')),
  github_id bigint,
  name text,
  avatar_url text,
  added_by text,
  added_at timestamptz not null default now(),
  last_seen_at timestamptz
);

-- Signed-in browsers. Only a hash of the cookie's token is stored.
create table if not exists admin_sessions (
  token_hash text primary key,
  login text not null,
  github_id bigint,
  name text,
  avatar_url text,
  csrf_token text not null,
  expires_at timestamptz not null
);
create index if not exists admin_sessions_login on admin_sessions (login);

-- Sign-ins in progress: each state is used once, within ten minutes.
create table if not exists admin_oauth_states (
  state_hash text primary key,
  expires_at timestamptz not null
);

-- Files changed in the admin and waiting to be published, one row per file.
create table if not exists admin_pending (
  path text primary key,
  text text not null,
  hash text not null,
  base_sha text not null,
  summaries jsonb not null default '[]',
  editors jsonb not null default '[]',
  updated_by text not null,
  updated_at timestamptz not null default now()
);

create table if not exists admin_activity (
  id bigserial primary key,
  at timestamptz not null default now(),
  login text not null,
  action text not null,
  summary text not null
);
