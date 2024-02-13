// Initiate connection to the Postgres database
const { Pool } = require('pg')

const POSTGRES_CONNECTION_URL = process.env.POSTGRES_PROD_CONNECTION_URL
// POSTGRES_CONNECTION_URL="postgres://postgres:password@postgres-db:5432/xpressbuy"



const pool = new Pool({
    connectionString: POSTGRES_CONNECTION_URL,
})

module.exports = pool;