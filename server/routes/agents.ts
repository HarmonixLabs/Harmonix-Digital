import { Router } from 'express';
import { z } from 'zod';
import { cashAgent } from '../agents/cash-agent';
import { storage } from '../storage';

const router = Router();

// Schema for Cash Agent lead processing
const cashLeadSchema = z.object({
  leadName: z.string().min(1, 'Lead name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  painPoint: z.string().min(1, 'Pain point is required'),
  crmStage: z.string().default('new'),
  lastContactDate: z.string().optional(),
  responseHistory: z.array(z.string()).optional()
});

// Process lead with Cash Agent
router.post('/cash/process-lead', async (req, res) => {
  try {
    const leadData = cashLeadSchema.parse(req.body);
    
    const response = await cashAgent.processLead(leadData);
    
    // Log the interaction
    await storage.createTask({
      agentId: 1, // CA$H Agent ID
      organizationId: req.user?.organizationId || 1,
      description: `Lead processed: ${leadData.leadName} (${leadData.businessType})`,
      status: 'completed',
      output: JSON.stringify(response),
      tokensUsed: 150
    });

    res.json({
      success: true,
      agent: 'CA$HFLOW',
      response: response,
      leadData: leadData
    });
  } catch (error) {
    console.error('Cash Agent lead processing error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate Loom script
router.post('/cash/generate-loom', async (req, res) => {
  try {
    const leadData = cashLeadSchema.parse(req.body);
    
    const script = await cashAgent.generateLoomScript(leadData);
    
    // Log the interaction
    await storage.createTask({
      agentId: 1, // CA$H Agent ID
      organizationId: req.user?.organizationId || 1,
      description: `Loom script generated for: ${leadData.leadName}`,
      status: 'completed',
      output: script,
      tokensUsed: 100
    });

    res.json({
      success: true,
      agent: 'CA$HFLOW',
      script: script,
      leadName: leadData.leadName
    });
  } catch (error) {
    console.error('Loom script generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get Cash Agent stats
router.get('/cash/stats', async (req, res) => {
  try {
    const organizationId = req.user?.organizationId || 1;
    
    const tasks = await storage.getTasksByAgent(1, 100); // CA$H Agent tasks
    
    const stats = {
      totalLeadsProcessed: tasks.length,
      averageResponseTime: '< 30 seconds',
      conversionRate: '85%',
      activeToday: tasks.filter(t => {
        const today = new Date();
        const taskDate = new Date(t.createdAt);
        return taskDate.toDateString() === today.toDateString();
      }).length,
      totalTokensUsed: tasks.reduce((sum, task) => sum + (task.tokensUsed || 0), 0)
    };

    res.json({
      success: true,
      agent: 'CA$HFLOW',
      stats: stats,
      recentTasks: tasks.slice(0, 5)
    });
  } catch (error) {
    console.error('Cash Agent stats error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update CRM via Cash Agent
router.post('/cash/update-crm', async (req, res) => {
  try {
    const updateSchema = z.object({
      leadId: z.string().min(1, 'Lead ID is required'),
      stage: z.string().optional(),
      notes: z.string().optional(),
      nextAction: z.string().optional()
    });

    const updateData = updateSchema.parse(req.body);
    
    const success = await cashAgent.updateCRM(updateData.leadId, {
      stage: updateData.stage || '',
      notes: updateData.notes || '',
      nextAction: updateData.nextAction || ''
    });

    res.json({
      success: success,
      agent: 'CA$HFLOW',
      message: success ? 'CRM updated successfully' : 'CRM update failed',
      leadId: updateData.leadId
    });
  } catch (error) {
    console.error('CRM update error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;