## PREREQUISITES
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

## HOW TO RUN (VITE and NODE DEVELOPMENT)
- STEP 1 : Open project root folder
- STEP 2 : Open new terminal
- STEP 3 : Execute "cd client"
- STEP 4 : Execute "pnpm i"
- STEP 5 : Execute "pnpm dev"
- STEP 6 : Repeat steps 2-5, but for step 3. execute "cd server" instead
- STEP 7 : Open mysql, open "mysql init.sql" and run query
- STEP 8 : Open given localhost link in browser

## HOW TO RUN (ELECTRON DEVELOPMENT)
- STEP 1 : Open project root folder
- STEP 2 : Open new terminal
- STEP 3 : Execute "pnpm i"
- STEP 4 : Execute "pnpm --filter client build"
- STEP 5 : Execute "pnpm dev" to test electron development
- STEP 6 : Execute "pnpm build" to build and package electron app
- STEP 7 : Open "root/dist/win-unpacked" and run "membership-management-system.exe"

NOTE: Make sure MySQL account is localhost, root with pass: root OR change .env credintials to match
your existing MySQL account

## TROUBLESHOOT
1. if pnpm is not working, run npm i -g pnpm@latest (installs pnpm globally)

## TODOs
- Visits
  - ACR122U (RFID scanner, use UUID as ID)

- Optional
  - Customization of date extension options table (WIP)
  - Profile picture crop UI
  - Add batch delete of members with cancelled_status in settings
  - Logged-in account icon should change if logged-in account is staff for clarity

- FIX
  - Add RFID (not priority) column in members table. Make visit log manual input accept RFID column