# Gym-Membership-Management-System
Locally hosted webapp for managing memberships

## HOW TO RUN
1. open project root folder
2. open new terminal
3. execute "cd client"
4. execute "pnpm i"
5. execute "pnpm dev"
6. repeat steps 2-5, but for step 3. execute "cd server" instead
7. open mysql, open "mysql init.sql" and run query

## TROUBLESHOOT
1. if pnpm is not working, run npm i -g pnpm@latest (installs pnpm globally)

## TODOs
- Home
  - Analytics : Bar graphs for statistical data
  - Generate reports

- Visits
  - ACR122U (RFID scanner, use UUID as ID)

- Backup (Admin only)
  - Separate database
  - Restore function
  - Decide on file type (CSV?)

- Optional
  - Customization of date extension options table
  - Profile picture crop UI

- FIX
  - Members info page and Account info page design
  - Apply same char limit of 25 before truncating name to other tables (update log, cancelled members, visit log)