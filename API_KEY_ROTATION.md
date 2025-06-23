# API Key Rotation Schedule

## Go High Level API Key

**Current Key:** GHL_API_KEY_HARMONIX (active)
**New Key Available:** pit-df5d16c0-9ee1-418b-a1c6-f9799d348032
**Rotation Timeline:** 6-7 days from June 23, 2025
**Target Date:** June 29-30, 2025

### Current Token Status
- Environment Variable: GHL_API_KEY_HARMONIX
- Status: Active and working
- Purpose: Harmonix CRM integration

### New Token Information
```
pit-df5d16c0-9ee1-418b-a1c6-f9799d348032
```

### Rotation Process
1. **Before Expiration:** Update GHL_API_KEY secret with new token
2. **Test Integration:** Verify CRM sync functionality
3. **Monitor Logs:** Ensure no authentication errors
4. **Update Documentation:** Record successful rotation

### Critical Systems Affected
- User registration CRM sync
- Lead capture and contact creation
- Opportunity pipeline updates
- Activity tracking

### Backup Plan
If rotation fails:
1. Revert to previous working token
2. Generate new API key from GHL dashboard
3. Update secret immediately
4. Test all CRM endpoints

### Monitoring Checklist
- [ ] CRM contact creation working
- [ ] Lead capture forms syncing
- [ ] Activity tracking operational
- [ ] Error logs clear of auth failures

**Note:** GHL tokens rotate every 7 days. Set calendar reminder for June 30, 2025.