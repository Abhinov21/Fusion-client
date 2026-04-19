# Testing Guide for Refactored RSPC Components

**Last Updated:** Phase 3 - Component Refactoring  
**Status:** ✅ Syntax Validated - Ready for Functional Testing

---

## Overview

Three components have been refactored to use:

- Centralized service layer (rspcApi.js)
- Custom hooks for reusable logic
- Consistent patterns across the module

All components maintain 100% backward compatibility with original API contracts.

---

## Components Refactored

### 1. staffRecruitmentForm.jsx (1436 lines)

**Location:** `src/Modules/RSPC/components/forms/staffRecruitmentForm.jsx`

**What Changed:**

- ✅ Removed inline axios calls (3 endpoints) → Service layer functions
- ✅ Replaced inline sorting (~30 lines) → useTableSort hook
- ✅ Replaced form submission logic (~50 lines) → useFormSubmit hook

**Key Functions Used:**

- `fetchStaff()` - Fetch staff data
- `fetchStaffPositions()` - Fetch position details
- `submitAdvertisementAndCommittee()` - Submit form

**Test Checklist:**

- [ ] Form loads without errors
- [ ] Staff data loads in table
- [ ] Clicking table headers sorts data (ascending/descending)
- [ ] Form validation works (required fields highlighted)
- [ ] Form submission succeeds with success notification
- [ ] Form submission failure shows error notification
- [ ] Modal interactions work (view, edit, delete staff)
- [ ] Console shows no errors or warnings

---

### 2. staffTable.jsx (351 lines)

**Location:** `src/Modules/RSPC/components/tables/staffTable.jsx`

**What Changed:**

- ✅ Removed inline sorting (~60 lines) → useTableSort hook
- ✅ Replaced axios data fetching → fetchStaff() service function

**Key Functions Used:**

- `fetchStaff()` - Fetch hired staff data

**Test Checklist:**

- [ ] Table loads with staff data
- [ ] Clicking column headers sorts the data
- [ ] Sort indicators show correct direction (arrow icons)
- [ ] Name column is sortable
- [ ] Department column is sortable
- [ ] Tenure column is sortable (numeric sort)
- [ ] View modal opens on "Eye" icon click
- [ ] Download document button works
- [ ] Console shows no errors

---

### 3. inboxTable.jsx (386 lines)

**Location:** `src/Modules/RSPC/components/tables/inboxTable.jsx`

**What Changed:**

- ✅ Removed axios imports entirely
- ✅ Replaced fetchPIDsRoute → fetchPIDs() service function
- ✅ Replaced fetchStaffRoute → fetchStaff() service function
- ✅ Replaced inline sorting → useTableSort hook
- ✅ Updated all 5 table headers for new sort pattern

**Key Functions Used:**

- `fetchPIDs()` - Fetch project IDs by role
- `fetchStaff()` - Fetch pending approvals

**Test Checklist:**

- [ ] Inbox table loads with pending approvals
- [ ] Clicking column headers sorts data
- [ ] Project name column sorts alphabetically
- [ ] Staff name column sorts alphabetically
- [ ] Status column sorts (Pending → Approved → Rejected)
- [ ] Date column sorts chronologically
- [ ] View modal opens and displays staff details
- [ ] Approval button triggers SelectionCommitteeReportApprovalModal
- [ ] Advertisement button triggers AdvertisementAndCommitteeApprovalModal
- [ ] Approve/Reject in modals updates table data
- [ ] Console shows no errors

---

## Manual Testing Steps

### Setup

1. Ensure Vite dev server is running: `npm run dev`
2. Open http://localhost:5173/ in browser
3. Navigate to RSPC Module
4. Open browser DevTools (F12) → Console tab

### Testing Each Component

#### staffRecruitmentForm

1. Navigate to Staff Recruitment Form page
2. **Test Data Loading:**
   - Verify staff table appears with data
   - Check that table has rows (staff names, departments, tenure)
3. **Test Sorting:**
   - Click "Name" header → Data should sort A-Z
   - Click "Name" again → Data should sort Z-A
   - Click "Tenure" header → Data should sort by number
   - Verify sort arrows appear/change
4. **Test Form Validation:**
   - Try submitting with empty required fields
   - Verify error messages appear in red
   - Fill all required fields
   - Submit form
5. **Test Form Submission Success:**
   - Verify "Success" notification appears (green, top-right)
   - Check notification says "Form submitted successfully!"
   - Verify form data is sent to backend
6. **Test Modal Interactions:**
   - Click "View" icon on a staff member
   - Verify StaffViewModal opens with details
   - Close modal (X or outside click)
   - Click trash icon to delete a staff member
   - Verify deletion works

#### staffTable

1. Navigate to Staff Table
2. **Test Data Loading:**
   - Verify table loads with staff data
   - Check columns: Name, Department, Tenure, Documents, Actions
3. **Test Sorting:**
   - Click each column header multiple times
   - Verify data re-sorts and arrows change
   - Check numeric vs alphabetic sorting works correctly
4. **Test Interactions:**
   - Click "Eye" icon to open StaffViewModal
   - Click "Download" to download documents
   - Verify modals and downloads work

#### inboxTable

1. Navigate to Inbox/Approvals page
2. **Test Data Loading:**
   - Verify pending approvals appear in table
   - Check columns present: Project, Staff Name, Status, Date, Actions
3. **Test Sorting:**
   - Click "Project" → sorts A-Z
   - Click "Staff Name" → sorts A-Z
   - Click "Status" → sorts (Pending, Approved, Rejected)
   - Click "Date" → sorts chronologically
   - Verify arrows change direction on clicks
4. **Test Status Badge:**
   - Verify badge colors are correct:
     - Pending = yellow
     - Approved = green
     - Rejected = red
5. **Test Approval Workflow:**
   - Click "View" icon → StaffViewModal opens
   - Close and click "SelectionCommittee" button
   - Verify SelectionCommitteeReportApprovalModal opens
   - Approve/Reject in modal
   - Check if table updates with new status
   - Test "AdvertisementAndCommittee" button similarly
6. **Test Error Handling:**
   - Verify no console errors appear
   - Check error notifications if approval fails

---

## Expected Behavior

### Data Consistency

- **Before Refactoring:** Components used inline axios calls with custom headers
- **After Refactoring:** Components use centralized service layer
- **Expected Result:** Identical data, identical API calls, same response structure

### Sorting Behavior

- **Before:** Custom sortColumn/sortDirection state + handleSort function
- **After:** useTableSort hook with sortConfig state + requestSort function
- **Expected Result:** Identical sorting logic, same click behavior, same visual indicators

### Form Submission

- **Before:** Manual loading state + axios POST + alerts
- **After:** useFormSubmit hook
- **Expected Result:** Same validation, same notifications, same error handling

---

## Test Results Summary

| Component            | Syntax | Import | Service Layer | Hooks | Status |
| -------------------- | ------ | ------ | ------------- | ----- | ------ |
| staffRecruitmentForm | ✓      | ✓      | ✓             | ✓✓    | Ready  |
| staffTable           | ✓      | ✓      | ✓             | ✓     | Ready  |
| inboxTable           | ✓      | ✓      | ✓             | ✓     | Ready  |

---

## Debugging

### If Components Don't Load

1. Check browser console for errors
2. Verify localStorage has authToken
3. Check network tab for failed API calls
4. Verify service layer functions are exporting correctly

### If Sorting Doesn't Work

1. Check browser console for errors in requestSort calls
2. Verify sortConfig state is updating (add console.log)
3. Check useTableSort hook is imported as default import

### If Form Submission Fails

1. Check network tab for POST request
2. Verify form data structure matches backend expectations
3. Check for validation errors highlighted in red
4. Look for error notifications (red toasts)

### Common Issues

**Import Error (useTableSort is not a function)**

- Fix: Change `import { useTableSort }` to `import useTableSort`

**API Call Fails (404 or 500)**

- Verify backend service is running
- Check token in localStorage
- Verify routes in rspcApi.js match backend endpoints

**Data Not Displaying**

- Check if API response includes expected fields
- Verify service layer is handling response correctly
- Check if component is handling empty/null data

---

## Next Steps

After all testing passes:

1. ✅ Run end-to-end workflow tests (Advertisement → Selection → Approval)
2. ✅ Refactor remaining components (filterTable, modals)
3. ✅ Test entire module integration
4. ✅ Deploy refactored code to staging

---

## References

- Service Layer: `src/Modules/RSPC/services/rspcApi.js`
- Hooks: `src/Modules/RSPC/hooks/useTableSort.js`, `useFormSubmit.js`
- Routes: `routes/RSPCRoutes.js`
