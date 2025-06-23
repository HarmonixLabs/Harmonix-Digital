# API Key Rotation Schedule - Harmonix Platform

## Go High Level API Key Management

### Current Active Key
- **Key ID**: GHL_API_KEY_HARMONIX
- **Status**: Active and functional
- **Expiration**: June 30, 2025
- **Usage**: CRM integration and contact management

### Scheduled Rotation
- **New Token**: pit-df5d16c0-9ee1-418b-a1c6-f9799d348032
- **Availability**: 6-7 days from activation
- **Target Date**: June 29-30, 2025
- **Action Required**: Update environment variable before current key expires

### Rotation Procedure
1. **Pre-rotation Checks** (June 28-29)
   - Verify new token is available
   - Test new token with read-only operations
   - Prepare environment variable update

2. **Rotation Day** (June 30)
   - Update GHL_API_KEY_HARMONIX environment variable
   - Test CRM integration functionality
   - Verify webhook processing continues
   - Monitor for any integration failures

3. **Post-rotation Validation**
   - Confirm contact creation/updates work
   - Test webhook endpoint responses
   - Verify no authentication errors in logs

### Backup Plans
- **Fallback Key**: Keep old key available for 24 hours post-rotation
- **Manual Processing**: If automated CRM fails, log contacts for manual import
- **Service Continuity**: Platform registration continues regardless of CRM status

### Testing Commands
```bash
# Test current integration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@harmonix.com","password":"test123"}'

# Test webhook endpoint
curl "${HARMONIX_GHL_WEBHOOK}" \
  -H "Content-Type: application/json" \
  -d '{"contact":{"email":"test@harmonix.com"},"eventType":"contact_created"}'
```

### Monitoring
- **Health Check**: /health endpoint shows GHL service status
- **Error Logs**: Monitor server logs for authentication failures
- **User Impact**: Registration flow continues even if CRM integration fails

---

**Next Action**: Schedule rotation for June 30, 2025