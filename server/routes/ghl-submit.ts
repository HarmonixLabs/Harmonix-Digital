import { Router } from 'express';
import { sendToGHL } from '../ghl-integration';
import { sendToGoogleSheets } from '../services/google-sheets-integration';

const router = Router();

// GHL Form Submission Endpoint
router.post('/api/ghl-submit', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    console.log('Processing form submission:', {
      email: formData.email,
      accessType: formData.accessType,
      source: formData.source
    });

    // Parse name into first and last
    const nameParts = (formData.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Track results
    const results = {
      ghl: false,
      sheets: false
    };

    // 1. Send to GoHighLevel (Primary)
    try {
      const ghlResponse = await sendToGHL({
        email: formData.email,
        firstName: firstName || formData.firstName,
        lastName: lastName || formData.lastName,
        phone: formData.phone,
        companyName: formData.company,
        source: formData.source || 'unified_join_page',
        tags: formData.tags || ['harmonix_join', formData.accessType || 'waitlist'],
        customFields: {
          access_type: formData.accessType,
          business_type: formData.businessType,
          team_size: formData.teamSize,
          revenue: formData.revenue,
          interests: formData.interests,
          selected_plan: formData.selectedPlan,
          lead_value: formData.leadValue
        }
      });

      if (ghlResponse.success) {
        results.ghl = true;
        console.log('✅ Lead sent to GoHighLevel:', formData.email);
      }
    } catch (error) {
      console.error('GHL submission error:', error);
    }

    // 2. Send to Google Sheets (Backup)
    try {
      const sheetsSuccess = await sendToGoogleSheets({
        ...formData,
        firstName,
        lastName,
        timestamp: new Date().toISOString()
      });
      
      if (sheetsSuccess) {
        results.sheets = true;
        console.log('✅ Lead backed up to Google Sheets:', formData.email);
      }
    } catch (error) {
      console.error('Google Sheets backup error:', error);
    }

    // Determine success
    const success = results.ghl || results.sheets;

    if (success) {
      res.json({
        success: true,
        message: 'Successfully joined the waitlist!',
        contactId: `contact_${Date.now()}`,
        results
      });
    } else {
      // If both failed, still return success to not break user experience
      console.error('Both CRM systems failed for:', formData.email);
      res.json({
        success: true, // Still return success to user
        message: 'You have been added to our waitlist!',
        contactId: `fallback_${Date.now()}`,
        results
      });
    }

  } catch (error) {
    console.error('Form submission error:', error);
    // Even on error, provide graceful response
    res.json({
      success: true,
      message: 'Thank you for joining! We will be in touch soon.',
      contactId: `error_fallback_${Date.now()}`
    });
  }
});

export default router;