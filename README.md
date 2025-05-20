## HOW TO RUN (DEVELOPMENT)
- STEP 1 : Open project root folder
- STEP 2 : Open new terminal
- STEP 3 : Execute "cd client"
- STEP 4 : Execute "pnpm i"
- STEP 5 : Execute "pnpm dev"
- STEP 6 : Repeat steps 2-5, but for step 3. execute "cd server" instead
- STEP 7 : Open mysql, open "mysql init.sql" and run query

## TROUBLESHOOT
1. if pnpm is not working, run npm i -g pnpm@latest (installs pnpm globally)

## DEPLOYMENT
- STEP 1 : Install MySQL, Node
- STEP 2 : Set account for MySQL localhost, user: root, pass: root
- STEP 3 : Set MySQL path
  - STEP 3.1 : Win + R, execute "sysdm.cpl"
  - STEP 3.2 : Select "Advanced", Select "Environment Variables"
  - STEP 3.3 : On "System Variables", find "Path" variable, Select "Edit", Select "New"
  - STEP 3.4 : Input "C:\Program Files\MySQL\MySQL Server 8.0\bin" (or the directory of MySLQ bin based on client's PC), Select "OK" to complete operation
- STEP 4 : Install gzip
  - STEP 4.1 : Open terminal (run as administarator)
  - STEP 4.2 : Execute "choco install gzip"
  - STEP 4.3 : Yes to prompts until finish
- STEP 5 : Verify installations
  - STEP 5.1 : Open terminal
  - STEP 5.2 : Execute "node", execute "require("zlib")
  - STEP 5.3 : Find { Gzip: [Function: Gzip], … }
  - STEP 5.4 : Open new terminal
  - STEP 5.5 : Execute "gzip --version"

## TODOs
- Visits
  - ACR122U (RFID scanner, use UUID as ID)

- Optional
  - Customization of date extension options table (WIP)
  - Profile picture crop UI
  - Add batch delete of members with cancelled_status in settings
  - Logged-in account icon should change if logged-in account is staff for clarity

- FIX
  - Members info page and Account info page design
  - Apply same char limit of 25 before truncating name to other tables (update log, cancelled members, visit log)
  - Search filters needs customized filter for update_log table
  - There should be a weekly automatic backup with cron job