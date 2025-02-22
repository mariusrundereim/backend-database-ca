[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/GMhoNsa2)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=18245905&assignment_repo_type=AssignmentRepo)

![](http://images.restapi.co.za/pvt/Noroff-64.png)

# Noroff

# Back-end Development Year 1

### Databases - Course Assignment 1 <sup>V4</sup>

Startup code for Noroff back-end development 1 - Front-end Technologies course.

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://images.restapi.co.za/pvt/ca_important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://images.restapi.co.za/pvt/help.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

# Application Installation and Usage Instructions

1. Clone the repository

```bash
git clone <repository-url>
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

# DATABASEACCESS
