# Pipedream Integration Setup Guide

## 🔗 Where to Add Your API Keys & Webhooks

### **Step 1: Add API Keys in Replit**

1. **In your Replit project**, click the **🔒 Secrets** tab (lock icon in left sidebar)
2. **Add these secrets** by clicking "New Secret":

#### **Required Secrets:**

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `PIPEDREAM_API_KEY` | Your main Pipedream API token | `pd_abc123...` |
| `PIPEDREAM_CASH_LEAD_WEBHOOK` | CA$H Agent lead qualification | `https://eo12345.m.pipedream.net` |
| `PIPEDREAM_GRACE_SUPPORT_WEBHOOK` | GRACE Agent customer support | `https://eo67890.m.pipedream.net` |
| `PIPEDREAM_ECHO_POSTING_WEBHOOK` | ECHO Agent social media posting | `https://eo11111.m.pipedream.net` |
| `PIPEDREAM_FLOW_PROCESS_WEBHOOK` | FLOW Agent process automation | `https://eo22222.m.pipedream.net` |
| `PIPEDREAM_KAIROS_PM_WEBHOOK` | KAIROS Agent project management | `https://eo33333.m.pipedream.net` |
| `PIPEDREAM_SOL_ORCHESTRATION_WEBHOOK` | SOL Agent AI orchestration | `https://eo44444.m.pipedream.net` |

#### **Optional Additional Secrets** (for advanced workflows):

```
PIPEDREAM_CASH_SALES_WEBHOOK
PIPEDREAM_CASH_REVENUE_WEBHOOK
PIPEDREAM_CASH_CRM_WEBHOOK
PIPEDREAM_GRACE_CHAT_WEBHOOK
PIPEDREAM_GRACE_ROUTING_WEBHOOK
PIPEDREAM_GRACE_SENTIMENT_WEBHOOK
PIPEDREAM_ECHO_SCHEDULING_WEBHOOK
PIPEDREAM_ECHO_ENGAGEMENT_WEBHOOK
PIPEDREAM_ECHO_TRENDS_WEBHOOK
PIPEDREAM_FLOW_OPTIMIZATION_WEBHOOK
PIPEDREAM_FLOW_ROUTING_WEBHOOK
PIPEDREAM_FLOW_INTEGRATION_WEBHOOK
PIPEDREAM_KAIROS_SCHEDULING_WEBHOOK
PIPEDREAM_KAIROS_COORDINATION_WEBHOOK
PIPEDREAM_KAIROS_TRACKING_WEBHOOK
PIPEDREAM_SOL_COORDINATION_WEBHOOK
PIPEDREAM_SOL_OPTIMIZATION_WEBHOOK
PIPEDREAM_SOL_HARMONY_WEBHOOK
```

---

## 🔍 How to Get Your Pipedream Credentials

### **Get Your API Key:**
1. Go to [pipedream.com](https://pipedream.com) and log in
2. Click your profile → **Account** → **API Keys**
3. Copy your **API Key** (starts with `pd_`)

### **Get Webhook URLs:**
1. In Pipedream, go to your **Workflows**
2. For each agent workflow, click **Edit**
3. Look for the **HTTP Trigger** step
4. Copy the **Webhook URL** (starts with `https://eo...`)

---

## 🤖 Agent Workflow Mapping

Your live agents will connect to these actions:

| Agent | Primary Action | Webhook Needed |
|-------|----------------|----------------|
| **CA$H** (Sales) | Lead Qualification | `PIPEDREAM_CASH_LEAD_WEBHOOK` |
| **GRACE** (Concierge) | Customer Support | `PIPEDREAM_GRACE_SUPPORT_WEBHOOK` |
| **ECHO** (Social Media) | Social Media Posting | `PIPEDREAM_ECHO_POSTING_WEBHOOK` |
| **FLOW** (Process/Workflow) | Process Automation | `PIPEDREAM_FLOW_PROCESS_WEBHOOK` |
| **KAIROS** (Project Management) | Project Management | `PIPEDREAM_KAIROS_PM_WEBHOOK` |
| **SOL** (Harmony Brain) | AI Orchestration | `PIPEDREAM_SOL_ORCHESTRATION_WEBHOOK` |

---

## 🚀 What Happens After Setup

Once you add the secrets:

1. **Demo Page Enhancement**: Agent demos will trigger your live Pipedream workflows
2. **Real-Time Integration**: Users see actual workflow execution results
3. **Live Data Flow**: Your agents receive real data from demo interactions
4. **Performance Tracking**: Monitor workflow executions via Pipedream dashboard

---

## 🔧 Testing Your Integration

After adding secrets:

1. Go to `/demo` page in your Harmonix platform
2. Select any agent (CA$H, GRACE, ECHO, FLOW, KAIROS, SOL)
3. Type a test message and submit
4. Look for: **"✅ Pipedream Workflow Executed Successfully!"**
5. Check your Pipedream dashboard for execution logs

---

## 🆘 Troubleshooting

**If workflows don't trigger:**
- Verify webhook URLs are correct (start with `https://eo...`)
- Check API key is valid in Pipedream account
- Ensure workflows are **published** and **active**

**If you get errors:**
- Check the console logs in your Replit project
- Verify webhook URLs accept POST requests
- Test webhooks directly in Pipedream

---

## 💡 Advanced Integration Options

**Multiple Webhook Support**: Each agent can have multiple workflows for different actions
**Custom Data Flow**: We can modify the data payload sent to your workflows
**Bidirectional Sync**: Set up webhooks that send data back to Harmonix
**Error Handling**: Automatic fallback to demo mode if workflows fail

Ready to connect your live agents? Add those secrets and let's see your Pipedream workflows in action!