# Phase 3 - Refactoring Roadmap & Priority Queue

**Completion Target**: All RSPC module components using centralized service layer + custom hooks  
**Current Progress**: 2/15 major components refactored

---

## Prioritized Refactoring Queue

### Tier 1: HIGH PRIORITY (User-Facing, Frequent Use)

#### 1. InboxTable

**File**: `components/tables/inboxTable.jsx`
**Impact**: High - Main approval/action interface for users
**Status**: ⏳ Pending refactoring
**Estimated LOC to Remove**: ~60
**Pattern**: Same as staffTable - sorting + data fetching
**Dependencies**:

- [ ] Add useTableSort hook usage
- [ ] Replace axios calls with service layer function

#### 2. FilterTable

**File**: `components/tables/filterTable.jsx`
**Impact**: Medium - Data search/filter interface
**Status**: ⏳ Pending refactoring  
**Estimated LOC to Remove**: ~80
**Pattern**: Advanced table with filters + sorting
**Dependencies**:

- [ ] Add useTableSort hook usage
- [ ] Map axios routes to service layer functions

---

### Tier 2: MEDIUM PRIORITY (Form Submissions, Complex Workflows)

#### 3. JoiningReportAndIDCardFormModal

**File**: `components/modals/joiningReportAndIDCardFormModal.jsx`
**Impact**: Medium-High - Staff document upload workflow
**Status**: ⏳ Pending refactoring
**Estimated LOC**: 200-300 lines
**Pattern**: Form + file upload (similar to projectRegisterForm)
**Changes Needed**:

- [ ] Extract axios POST call → service layer
- [ ] Implement useFormSubmit hook
- [ ] Verify FormData handling for file upload

#### 4. SelectionCommitteeReportFormModal

**File**: `components/modals/selectionCommitteeReportFormModal.jsx`
**Impact**: Medium - Selection committee reporting
**Status**: ⏳ Pending refactoring
**Estimated LOC**: 150-250 lines
**Pattern**: Complex form submission
**Changes Needed**:

- [ ] Move axios call to service layer (already exists: submitStaffSelectionReport)
- [ ] Apply useFormSubmit hook
- [ ] Update state management if needed

---

### Tier 3: OPTIONAL/LOWER PRIORITY (View-Only Modals)

#### 5. StaffViewModal

**File**: `components/modals/staffViewModal.jsx`
**Impact**: Low - Read-only display modal
**Status**: ⏳ Investigate if refactoring needed
**Pattern**: Display-only (may not need changes)
**Action**: Check if it has any axios calls before refactoring

#### 6. ProjectViewModal

**File**: `components/modals/projectViewModal.jsx`
**Impact**: Low - Read-only display modal
**Status**: ⏳ Investigate if refactoring needed
**Pattern**: Display-only (may not need changes)
**Action**: Check if it has any axios calls before refactoring

#### 7. AdvertisementAndCommitteeApprovalModal

**File**: `components/modals/advertisementAndCommitteeApprovalModal.jsx`
**Impact**: Low - Approval workflow modal
**Status**: ⏳ Pending refactoring
**Pattern**: Approval action submission
**Changes Needed**: Check for axios calls → service layer

#### 8. SelectionCommitteeReportApprovalModal

**File**: `components/modals/selectionCommitteeReportApprovalModal.jsx`
**Impact**: Low - Approval workflow modal
**Status**: ⏳ Pending refactoring
**Pattern**: Approval action submission
**Changes Needed**: Check for axios calls → service layer

#### 9. JoiningReportAndIDCardApprovalModal

**File**: `components/modals/joiningReportAndIDCardApprovalModal.jsx`
**Impact**: Low - Approval workflow modal
**Status**: ⏳ Pending refactoring
**Pattern**: Approval action submission
**Changes Needed**: Check for axios calls → service layer

---

## Remaining Refactoring Work Summary

### By Type

- **Forms**: 0 remaining (all refactored in Phase 1-3)
- **Form Modals**: 3 (joiningReportAndIDCardFormModal, selectionCommitteeReportFormModal, + potential others)
- **Approval Modals**: 3 (advertisementAndCommitteeApprovalModal, selectionCommitteeReportApprovalModal, joiningReportAndIDCardApprovalModal)
- **View Modals**: 2 (staffViewModal, projectViewModal) - may need no changes
- **Data Tables**: 2 (inboxTable, filterTable)
- **Total**: 10+ components

### By Effort

- **Quick Wins** (1-2 hours each): Tables (inboxTable, filterTable), View modals (if read-only)
- **Medium Tasks** (2-3 hours each): Form modals with file uploads
- **Complex Tasks** (3-4 hours each): Approval modals with conditional logic

### Total Estimated Work

- **Refactoring**: 15-20 hours
- **Testing**: 5-10 hours
- **Total Phase 3 Estimated**: 20-30 hours

---

## Recommended Refactoring Order

### Week 1

1. **Monday**: Refactor inboxTable (user-facing, repeatable pattern)
2. **Tuesday**: Refactor filterTable (similar pattern to tables)
3. **Wednesday**: Quick audit of view modals (staffViewModal, projectViewModal)

### Week 2

4. **Thursday**: Refactor joiningReportAndIDCardFormModal (file upload)
5. **Friday**: Refactor selectionCommitteeReportFormModal (complex form)

### Week 3

6. **Monday-Wednesday**: Approval modals (similar patterns, can batch)
7. **Thursday-Friday**: Integration testing + final verification

---

## Service Layer Functions Already Available

✅ **GET Functions** (for data fetch modals):

- `fetchStaff()` - Staff data by project ID and type
- `fetchProjects()` - Project data by PIDs
- `fetchPIDs()` - PIDs by role
- `fetchProfessorIDs()` - Professor list
- `fetchStaffPositions()` - Staff positions by project
- `fetchBudget()` - Budget details

✅ **POST Functions** (for submission modals):

- `submitAdvertisementAndCommittee()` - Already used in staffRecruitmentForm
- `submitStaffSelectionReport()` - For selection committee report
- `submitStaffDocumentUpload()` - For joining report uploads
- `submitStaffDecision()` - For staff decisions
- `submitCommitteeAction()` - For committee actions
- `submitProjectClosure()` - Project closure
- `submitProjectCommencement()` - Project commencement

⚠️ **May Need Addition**: Check if approval modals need new service layer functions

---

## Testing Strategy

### Unit Testing (Per Component)

- [ ] Mock service layer calls
- [ ] Verify hook integrations
- [ ] Test error handling
- [ ] Validate prop passing

### Integration Testing (Workflows)

- [ ] Staff recruitment: Add → Register → Commencement → Closure
- [ ] Staff assignment: Document Upload → Selection Review → Approval → ID Card
- [ ] Project workflows: Access all refactored components in sequence
- [ ] Role-based access: Test as different role types

### Regression Testing

- [ ] No breaking changes to API contracts
- [ ] All validation rules still work
- [ ] UI appearance unchanged
- [ ] Form submission behavior identical

---

## Rollback & Safety Measures

### Before Each Refactoring

- [ ] Create git branch for component
- [ ] Backup existing API calls documentation
- [ ] Identify current users/dependencies

### During Refactoring

- [ ] Commit to git frequently
- [ ] Test service layer calls independently
- [ ] Verify hook behavior with test data

### After Refactoring

- [ ] Run linter on modified files
- [ ] Check for unused imports/functions
- [ ] Verify no console.errors in refactored code
- [ ] Test with real data

---

## Success Criteria for Phase 3

**Completion Definition**:

1. ✅ All forms using `useFormSubmit()` hook
2. ✅ All tables using `useTableSort()` hook
3. ✅ All data fetching via service layer (zero direct axios calls)
4. ✅ All modals either refactored OR documented as read-only
5. ✅ Complete workflow testing passes
6. ✅ Zero breaking changes to user-facing functionality

**Current Status**: 20% complete (2/10+ components)

---

## Notes & Observations

### Best Practices Observed

- Service layer completely insulates components from HTTP details
- Hooks reduce component complexity by 50-60%
- Utility functions (statusMapper, roleMapper) enable consistent UX
- All original validation logic preserved

### Potential Optimizations (Post-Phase 3)

- Consider request caching layer
- Implement pagination for large tables
- Add request timeout handling
- Implement retry logic for failed requests

### Known Constraints

- FormData multipart handling already working in service layer
- Token management centralized and secure
- CORS and credentials already configured in service layer

---

## Commands for Verification

```bash
# Find all remaining axios imports
find . -name "*.jsx" -path "*/RSPC/*" -exec grep -l "import axios" {} \;

# Count refactored vs remaining
echo "Refactored:" && find . -path "*/RSPC/*" ! -exec grep -l "import axios" {} \; | wc -l
echo "Remaining:" && find . -path "*/RSPC/*" -exec grep -l "import axios" {} \; | wc -l

# Verify service layer usage
grep -r "from.*services/rspcApi" src/Modules/RSPC/components/ | wc -l

# Check hook usage
grep -r "useTableSort\|useFormSubmit" src/Modules/RSPC/components/ | wc -l
```

---

**Last Updated**: 6 April 2026  
**Prepared By**: Refactoring Agent  
**Status**: ACTIVE - Ready for next refactoring batch
