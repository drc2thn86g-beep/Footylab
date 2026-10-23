-- Provider snapshot cache. Do not mix up API IDs with FootyLab editorial IDs.
-- Apply once after binding D1 with: npx wrangler d1 migrations apply footylab-data --remote
CREATE TABLE IF NOT EXISTS api_teams (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  league_id INTEGER NOT NULL,
  league TEXT NOT NULL,
  country TEXT NOT NULL,
  logo_url TEXT,
  last_synced_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_api_teams_synced ON api_teams(last_synced_at);

CREATE TABLE IF NOT EXISTS api_players (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  position TEXT,
  shirt_number INTEGER,
  photo_url TEXT,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS api_roster (
  team_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  checked_at TEXT NOT NULL,
  PRIMARY KEY (team_id, player_id),
  FOREIGN KEY (team_id) REFERENCES api_teams(id),
  FOREIGN KEY (player_id) REFERENCES api_players(id)
);
CREATE INDEX IF NOT EXISTS idx_api_roster_players ON api_roster(player_id);

CREATE TABLE IF NOT EXISTS api_sync_state (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
