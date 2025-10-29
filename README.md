# BEIRS_IMS_APP

- ROLE BASED AUTHENTICATION /  AUTHORIZATION
- STATUS NOTIFICATION via sms/app notification
- LOG INTERACTION HISTORY for MONITORING purposes

## RESIDENT 
- REGISTER, LOGIN, LOGOUT UPDATE PROFILE , 
- SUBMIT CASE/REPORTS (FILE BLOTTER) FORM (no update once submitted),
- REQUEST CERTIFICATIONS, 
- TRACK CASE STATUS, 
- Upload Media Files (e.g video, images)

## BRGY STAFF 
- REVIEW SUBMITTED CASE/ BLOTTER REPORT
- VIEW MULTIPLE SUBMITTED CASE/ BLOTTER REPORT 
- VIEW REQUESTOR RESIDENT INFO
- APPROVE/REJECT BLOTTER REPORT/CASE ( reject if unsatisfying evidences) 
- APPROVE/REJECT CERTIFICATIONS (brgy.clearance, kasal, etc. indigency, residency)

## ADMIN
- LOGIN/LOGOUT 
- CREATE ACCOUNT (CRUD) FOR RESIDENTS & STAFF
- VIEW ACCOUNTS (VIEW ALL USERS)
- VIEW ONE RECORD (USER)
- GENERATE HEATMAP REPORT - SUMMARY OF THE DANGER AREA based on number of submitted case(location mentioned) graph/chart
- REVIEW SUBMITTED CASE/ BLOTTER REPORT - APPROVE/REJECT 
- VIEW MULTIPLE SUBMITTED CASE/ BLOTTER REPORT
- REVIEW CERTIFICATES (brgy.clearance, kasal, etc. indigency, residency) APPROVE/REJECT

## 
### Steps in pushing your changes into github.
##

This is to ensure that code that are merged into the develop branch are bug-free and working as intended.

## commands 
 - git checkout develop - This will be the main branch
 - git pull - This is to ensure that our main branch is up-to-date in our local environment
 - git checkout -b feat/<your_assigned_role (e.g admin, resident, staff)>/<figma_screen_name (e.g register, login, admin-dashboard)>-001
   - example: git checkout -b feat/admin/login-001
       - This is for uniform git names.
 - git add . - This will add all changes into staged changes.
    - Note: be careful when using the dot(.) directive. check your changes before you commit, there might be some changes that should not be pushed.
 - git commit -m "<your_commit_message>" - This will commit your changes with your custom message
 - git push - this will push your changes.
   - Tip: After you use this command there will be a warning and a command you can use to push changes. copy that git command and paste it.

## Creating a Pull Request
- Go to github.com/beirs_ims.git
- At the top of the folder explorer you will see a message with a button showing "Pull Request" click the button to create Pull Request(PR)
- Anyone can merge as long as some one has reviewed it.
- Please double check your changes before you merge it, so that the main branch does not break.
