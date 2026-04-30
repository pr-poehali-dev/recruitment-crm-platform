CREATE TABLE IF NOT EXISTS lead_communications (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL,
    comm_date DATE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);