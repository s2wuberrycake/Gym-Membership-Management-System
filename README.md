# Gym-Membership-Management-System
Locally hosted webapp for managing memberships

## HOW TO RUN
1. open project root folder
2. open new terminal
3. execute "cd client"
4. execute "pnpm i"
5. execute "pnpm dev"
6. repeat steps 2-5, but for step 3. execute "cd server" instead

## TODOs
- Home
  - Analytics : Bar graphs for statistical data
  - Update log
  - Generate reports

- Members
  - Add profile-picture column and storing function
  - Data Culling

- Visits
  - ACR122U (RFID scanner, use UUID as ID)
  - RFID scanning  (For now, input UUID and logs as visit)
  - Visit log

- Backup (Admin only)
  - Separate database
  - Restore function
  - Decide on file type (CSV?)

- Settings (Admin only)
  - Optional customization of date extension table