let { Client } = require("pg");
const dbConfig = {
  connectionString:
    "postgres://mhytalrbgldtfu:b58c7bd4b60c9f01c801d287cc824d1f26b91669ba5e640dcf5471b6fbdec1be@ec2-34-231-221-151.compute-1.amazonaws.com:5432/d7t9r01hb29r9a",
  ssl: {
    rejectUnauthorized: false,
  },
};

const conn = new Client(dbConfig);
conn.connect();
module.exports = conn;
