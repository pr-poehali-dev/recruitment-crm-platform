
CREATE TABLE IF NOT EXISTS digitizing_orders (
    id SERIAL PRIMARY KEY,
    number VARCHAR(50) NOT NULL UNIQUE,
    client_legal VARCHAR(200),
    brand VARCHAR(200),
    position VARCHAR(200),
    city VARCHAR(100),
    stage VARCHAR(50) DEFAULT 'Поиск',
    recruiter VARCHAR(100),
    date_advance DATE,
    amount NUMERIC(12,2) DEFAULT 0,
    resource_plan NUMERIC(12,2) DEFAULT 0,
    resource_fact NUMERIC(12,2) DEFAULT 0,
    pct_sales NUMERIC(5,2) DEFAULT 5.0,
    pct_profile NUMERIC(5,2) DEFAULT 7.5,
    pct_recruiting NUMERIC(5,2) DEFAULT 30.0,
    pct_management NUMERIC(5,2) DEFAULT 7.5,
    pct_group_head NUMERIC(5,2) DEFAULT 10.0,
    payment_sales_status VARCHAR(20) DEFAULT 'Начислено',
    payment_sales_date DATE,
    payment_profile_status VARCHAR(20) DEFAULT 'Начислено',
    payment_profile_date DATE,
    payment_recruiting_status VARCHAR(20) DEFAULT 'Начислено',
    payment_recruiting_date DATE,
    payment_management_status VARCHAR(20) DEFAULT 'Начислено',
    payment_management_date DATE,
    payment_group_head_status VARCHAR(20) DEFAULT 'Начислено',
    payment_group_head_date DATE,
    date_extra_payment_1 DATE,
    date_extra_payment_2 DATE,
    date_extra_payment_3 DATE,
    date_closed DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digitizing_acts (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES digitizing_orders(id),
    act_number VARCHAR(50),
    act_date DATE,
    act_amount NUMERIC(12,2) DEFAULT 0,
    candidate_name VARCHAR(200),
    guarantee_period VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digitizing_activities (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES digitizing_orders(id),
    resumes_viewed INTEGER DEFAULT 0,
    calls_hh_free INTEGER DEFAULT 0,
    calls_hh_paid INTEGER DEFAULT 0,
    calls_avito INTEGER DEFAULT 0,
    interviews INTEGER DEFAULT 0,
    assessments INTEGER DEFAULT 0,
    shows INTEGER DEFAULT 0,
    internships INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digitizing_candidates (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES digitizing_orders(id),
    candidate_name VARCHAR(200),
    sent_date DATE,
    is_replacement BOOLEAN DEFAULT FALSE,
    replacing_candidate VARCHAR(200),
    replacement_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digitizing_replacements (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES digitizing_orders(id),
    exited_candidate VARCHAR(200),
    replacement_date DATE,
    provided_candidates INTEGER DEFAULT 0,
    resumes_viewed INTEGER DEFAULT 0,
    calls INTEGER DEFAULT 0,
    interviews INTEGER DEFAULT 0,
    internships INTEGER DEFAULT 0,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
