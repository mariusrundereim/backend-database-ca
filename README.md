# Back-end Development Year 1

Adoption

# Application Installation and Usage Instructions

1. Clone the repository

```bash
git clone (https://github.com/mariusrundereim/backend-database-ca.git)
cd databaseproject
```

2. Install dependencies

```bash
npm install
```

# Environment Variables

Create a `.env` file in the root directory using the following template:

```env
PORT=8080
DB_HOST=localhost
DB_USER=dabcaowner
DB_PASS=dabca1234
DB_NAME=adoptiondb
SESSION_SECRET=your_session_secret
```

# Additional Libraries/Packages

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.1",
    "connect-flash": "^0.1.1",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^16.3.1",
    "ejs": "^3.1.10",
    "express": "^4.18.2",
    "express-mysql-session": "^3.0.3",
    "express-session": "^1.18.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "mysql": "^2.18.1",
    "mysql2": "^3.12.0",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "sequelize": "^6.37.5"
  }
}
```

# NodeJS Version Used

- Node.js (v22.11.0)

# DATABASE

1. Create the database and user:

```sql
CREATE DATABASE adoptiondb;
CREATE USER 'dabcaowner'@'localhost' IDENTIFIED BY 'dabca1234';
GRANT ALL PRIVILEGES ON adoptiondb.* TO 'dabcaowner'@'localhost';
FLUSH PRIVILEGES;
```
