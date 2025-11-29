# Comprehensive System Flow Testing Plan

## Overview
This testing plan covers the complete workflow from job application to final completion, including auto-matching, admin management, payments, and visa processing.

## Prerequisites
- Development server running on localhost:3000
- Database properly seeded with sample data
- Admin account credentials available
- Test email addresses and phone numbers ready
- Sample job postings in careers section

## API Testing Results (Phase 0: Pre-Flow Testing)
**Objective:** Verify core API endpoints are functional before full workflow testing

**Steps Performed:**
1. **Test Applicants API**
   - Endpoint: `GET /api/applicants`
   - Result: Successfully returns array of applicants
   - Sample Data: Found 2 applicants (Test User and Joshua Mutuku)
   - Status: ✅ Working

2. **Check Applicant Schema**
   - Verified Prisma schema for Applicant model
   - Fields: id, firstName, lastName, email, phone, dateOfBirth, gender, nationality, passportNumber, passportExpiryDate, profilePhoto, cv, status, category, yearsOfExperience, trainingCompleted, medicalClearance, medicalExpiryDate
   - Note: No `autoMatchEnabled` field exists in Applicant model
   - Relations: documents, workExperience, certifications, visaProcessing, payments, shortlists, autoApplications

**Findings:**
- Applicants API returns data correctly
- No direct `autoMatchEnabled` field on Applicant (may be derived from autoApplications relation)
- Database has sample applicants ready for testing

**Next Steps:**
- Proceed to Phase 1: Job Application Process
- Consider adding `autoMatchEnabled` field if needed for applicant preferences

## Test Flow Breakdown

### Phase 1: Job Application Process
**Objective:** Verify user can successfully apply for jobs

**Steps:**
1. **Navigate to Careers Page**
   - Visit `/careers`
   - Verify page loads correctly
   - Check career cards display properly with enhanced styling

2. **Browse Available Jobs**
   - Scroll through career listings
   - Click "Read More" on a featured career
   - Verify modal opens with job details
   - Test modal close functionality

3. **Access Application Form**
   - Click "Apply Now" button in modal
   - Verify redirect to `/applicant-register?careerId=X`
   - Check form loads with pre-selected career

4. **Complete Application Form**
   - Fill personal information (name, email, phone, DOB, gender, nationality)
   - Enter passport details (number, expiry date)
   - Select category and experience level
   - Add work experience entries
   - Add certifications
   - Check training completion and medical clearance
   - Submit application

**Expected Results:**
- Form validation works correctly
- Application submits successfully (201 status)
- User receives confirmation
- No duplicate email errors for new applications

### Phase 2: Auto-Matching Process
**Objective:** Verify automatic job-applicant matching works

**Steps:**
1. **Trigger Auto-Match**
   - Login as admin
   - Navigate to admin dashboard
   - Access matching manager
   - Click "Auto Match" button
   - Verify matching process starts

2. **Monitor Matching Results**
   - Check matching API calls (`/api/auto-match/job`)
   - Verify matches are created in database
   - Check matching criteria (category, experience, certifications)

3. **Review Match Quality**
   - View generated matches
   - Verify relevance scoring
   - Check match percentages display correctly

**Expected Results:**
- Auto-matching completes without errors
- Matches are stored in database
- Matching algorithm considers all relevant criteria

### Phase 3: Admin Review and Management
**Objective:** Verify admin can review and manage applications/matches

**Steps:**
1. **Review New Applications**
   - Access applicants manager
   - View newly submitted application
   - Check all data saved correctly
   - Verify status shows as "new"

2. **Review Auto-Matches**
   - Access matching manager
   - View generated matches
   - Check match details and scores
   - Test match approval/rejection

3. **Update Application Status**
   - Change applicant status (new → shortlisted → interviewed → selected)
   - Verify status updates persist
   - Check audit logs record changes

**Expected Results:**
- All application data displays correctly
- Status updates work properly
- Audit trail maintains change history

### Phase 4: Payment Processing
**Objective:** Verify payment workflow functions correctly

**Steps:**
1. **Access Payment Management**
   - Navigate to payments manager
   - View payment records for selected applicant
   - Check payment status and amounts

2. **Process Payment**
   - Initiate payment for selected applicant
   - Verify payment gateway integration (Pesapal)
   - Check payment status updates

3. **Payment Confirmation**
   - Verify payment completion
   - Check payment records update
   - Confirm applicant status reflects payment

**Expected Results:**
- Payment processing initiates correctly
- Gateway integration works
- Payment status updates in real-time

### Phase 5: Visa Processing
**Objective:** Verify visa application and tracking works

**Steps:**
1. **Initiate Visa Process**
   - Access visa processing manager
   - Create visa application for selected applicant
   - Fill visa application details

2. **Track Visa Status**
   - Update visa status through stages
   - Upload required documents
   - Set visa appointment dates

3. **Visa Completion**
   - Mark visa as approved
   - Update applicant with visa details
   - Verify final status updates

**Expected Results:**
- Visa applications create successfully
- Status tracking works properly
- Document uploads function correctly

### Phase 6: End-to-End Verification
**Objective:** Confirm complete workflow integration

**Steps:**
1. **Applicant Dashboard Check**
   - Login as applicant
   - Verify application status visible
   - Check payment and visa status updates

2. **Admin Dashboard Overview**
   - Review complete applicant journey
   - Verify all statuses update correctly
   - Check reporting and analytics

3. **Data Integrity Check**
   - Verify all related records created
   - Check database relationships maintained
   - Confirm audit logs complete

**Expected Results:**
- Complete workflow functions end-to-end
- All system components integrate properly
- Data remains consistent throughout process

## Testing Scenarios

### Happy Path Testing
- Complete successful application → matching → selection → payment → visa → completion

### Edge Cases
- Duplicate email applications
- Incomplete application forms
- Payment failures
- Visa rejections
- Status rollback scenarios

### Error Handling
- Network failures during submission
- Database connection issues
- Invalid data submissions
- Authentication failures

## Performance Testing
- Multiple concurrent applications
- Large dataset matching performance
- Payment processing load
- File upload handling

## Security Testing
- Input validation and sanitization
- Authentication and authorization
- Data privacy compliance
- API security

## Tools Required
- Browser developer tools
- API testing tool (Postman/Insomnia)
- Database viewer
- Email testing service
- Payment gateway test environment

## Success Criteria
- All phases complete without critical errors
- Data flows correctly between system components
- User experience is smooth and intuitive
- Admin management functions properly
- Payment and visa processes integrate correctly
- System maintains data integrity throughout

## Risk Assessment
- Database corruption during testing
- Payment gateway test charges
- Email spam to real addresses
- System performance degradation

## Rollback Plan
- Database backup before testing
- Test data cleanup procedures
- System restore procedures
- Communication plan for issues
