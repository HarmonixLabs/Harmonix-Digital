// Go High Level Webhook Handler for Harmonix
import type { Request, Response } from 'express';
import { storage } from './storage';

interface GHLWebhookPayload {
  type: string;
  id: string;
  data: {
    contact?: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      companyName?: string;
      source?: string;
      tags?: string[];
      customFields?: Record<string, any>;
    };
    opportunity?: {
      id: string;
      name: string;
      contactId: string;
      value: number;
      status: string;
      stage: string;
    };
    appointment?: {
      id: string;
      contactId: string;
      title: string;
      startTime: string;
      endTime: string;
      status: string;
    };
  };
  timestamp: string;
}

export async function handleGHLWebhook(req: Request, res: Response) {
  try {
    console.log('🚀 Harmonix GHL Webhook received:', {
      body: req.body,
      timestamp: new Date().toISOString(),
      headers: req.headers['content-type']
    });
    
    const payload: GHLWebhookPayload = req.body;
    
    // Handle different payload structures - be more permissive for testing
    if (!payload.type && !payload.contact && !payload.data) {
      return res.status(400).json({ error: 'Invalid webhook payload - missing required data' });
    }

    switch (payload.type) {
      case 'contact.created':
      case 'contact.updated':
        await handleContactEvent(payload);
        break;
        
      case 'opportunity.created':
      case 'opportunity.updated':
        await handleOpportunityEvent(payload);
        break;
        
      case 'appointment.created':
      case 'appointment.updated':
      case 'appointment.cancelled':
        await handleAppointmentEvent(payload);
        break;
        
      default:
        console.log('Unhandled webhook type:', payload.type);
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleContactEvent(payload: GHLWebhookPayload) {
  const contact = payload.data.contact;
  if (!contact) return;

  console.log('Processing contact event:', payload.type, contact.email);
  
  // Check if user exists in our system
  if (contact.email) {
    const user = await storage.getUserByEmail(contact.email);
    if (user) {
      // Update user data based on GHL contact
      const updates: any = {};
      
      if (contact.firstName && contact.lastName) {
        updates.name = `${contact.firstName} ${contact.lastName}`;
      }
      
      if (contact.phone) {
        updates.phone = contact.phone;
      }
      
      if (Object.keys(updates).length > 0) {
        await storage.updateUser(user.id, updates);
        console.log('Updated user from GHL webhook:', user.email);
      }
    }
  }
  
  // Log activity for tracking
  console.log('GHL Contact Activity:', {
    type: payload.type,
    contact: contact.email,
    source: contact.source,
    tags: contact.tags,
    timestamp: payload.timestamp
  });
}

async function handleOpportunityEvent(payload: GHLWebhookPayload) {
  const opportunity = payload.data.opportunity;
  if (!opportunity) return;

  console.log('Processing opportunity event:', payload.type, opportunity.name);
  
  // Log opportunity activity
  console.log('GHL Opportunity Activity:', {
    type: payload.type,
    name: opportunity.name,
    value: opportunity.value,
    status: opportunity.status,
    stage: opportunity.stage,
    timestamp: payload.timestamp
  });
  
  // Here you could create tasks for agents based on opportunity stage
  // For example, when opportunity moves to "proposal" stage, create a follow-up task
}

async function handleAppointmentEvent(payload: GHLWebhookPayload) {
  const appointment = payload.data.appointment;
  if (!appointment) return;

  console.log('Processing appointment event:', payload.type, appointment.title);
  
  // Log appointment activity
  console.log('GHL Appointment Activity:', {
    type: payload.type,
    title: appointment.title,
    startTime: appointment.startTime,
    status: appointment.status,
    timestamp: payload.timestamp
  });
  
  // Here you could trigger agent tasks based on appointment events
  // For example, send reminder emails or prepare meeting materials
}

// Webhook verification helper (implement based on GHL documentation)
export function verifyGHLWebhook(payload: string, signature: string): boolean {
  // Implement signature verification if GHL provides webhook signing
  // For now, return true (you should implement proper verification)
  return true;
}