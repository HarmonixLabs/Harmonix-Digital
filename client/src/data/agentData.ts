// Comprehensive Agent Data with Advanced Modes and NFT Licensing
export interface AgentAdvancedMode {
  name: string;
  description: string;
  features: string[];
  capacity?: string;
}

export interface AgentTechStack {
  primary: string[];
  integrations: string[];
  optional?: string[];
}

export interface AgentNFTMetadata {
  agent_id: string;
  tier: string;
  utility: string[];
  performance_metrics: string[];
  token_type: string;
  rarity: string;
}

export interface AgentProfile {
  id: number;
  name: string;
  codename: string;
  archetype: string;
  role: string;
  bio: string;
  lore: string;
  personality: {
    tone: string;
    nlpStyle: string;
    vibe?: string;
  };
  coreFunction: string[];
  techStack: AgentTechStack;
  advancedModes: AgentAdvancedMode[];
  triggers: {
    internal: string[];
    external: string[];
  };
  dependencies: string[];
  nftLicensing: AgentNFTMetadata;
  monthlyPrice: number;
  oneTimePrice: number;
  setupPrice: number;
  maintenancePrice: number;
}

export const agentProfiles: AgentProfile[] = [
  {
    id: 1,
    name: "Cash",
    codename: "The Closer",
    archetype: "The Hunter",
    role: "Lead Gen, Booking, Sales Calls",
    bio: "Your tireless digital sales assassin. He qualifies, books, and follows up—at scale.",
    lore: "Born from high-ticket call rooms and persuasion labs, Cash was coded with NLP, urgency tactics, and emotional intelligence.",
    personality: {
      tone: "Charismatic. Direct. Outcome-driven.",
      nlpStyle: "Embedded urgency, trust, social proof. Uses mirroring, labeling, tactical empathy (Chris Voss style)",
      vibe: "Closer Archetype (Challenger with warmth)"
    },
    coreFunction: [
      "Prospecting → Qualifying → Booking → Nurturing",
      "Pipeline creation + follow-up + voice AI booking calls",
      "Connects Instantly, GHL, Nova Echo, and CRM into one ecosystem"
    ],
    techStack: {
      primary: ["GHL CRM", "Instantly.ai", "Clay + Apollo + Dropcontact", "Nova Echo"],
      integrations: ["Calendly / GHL Booking Links", "Zapier / Make", "ClickUp (Flow sync)"],
      optional: ["HubSpot Sales"]
    },
    advancedModes: [
      {
        name: "Nova Echo Hyper Mode",
        description: "Handles voice calls at massive scale",
        features: [
          "100,000+ voice calls/hr capacity",
          "Qualify, overcome objections, book in real time",
          "Sentiment analysis + smart objection routing",
          "Transfer to human closers when needed"
        ],
        capacity: "100,000 calls/hr"
      },
      {
        name: "Lead Score Swarm Mode",
        description: "Dynamic lead scoring and optimization",
        features: [
          "Scores leads based on reply behavior and data signals",
          "Reassigns or recycles based on performance",
          "Adjusts outreach based on decision-maker profiles"
        ]
      },
      {
        name: "Cash x Flow Sync",
        description: "Seamless task management integration",
        features: [
          "Syncs lead tasks automatically to ClickUp",
          "Tracks lead movement through Kanban",
          "Activates Flow's SOP tree based on pipeline stage"
        ]
      }
    ],
    triggers: {
      internal: [
        "New lead in Instantly, Clay, Apollo",
        "Booking event triggered via Calendly",
        "Sales email reply detected",
        "Form submission on funnel or GHL form"
      ],
      external: [
        "Inbound SMS from ad",
        "Call missed by team member",
        "Facebook lead ad webhook",
        "Cold DM reply with 'interested' keyword"
      ]
    },
    dependencies: ["Flow", "Lexi", "Oracle", "Kairos", "Aura"],
    nftLicensing: {
      agent_id: "001",
      tier: "Gold Tier Closer",
      utility: [
        "Usage rights to AI call agent 'Cash'",
        "Track AI performance via smart contract",
        "Bonus royalties if resold in ecosystem"
      ],
      performance_metrics: ["calls_made", "bookings", "revenue_tied"],
      token_type: "ERC-721",
      rarity: "Soulbound License Key"
    },
    monthlyPrice: 497,
    oneTimePrice: 4400,
    setupPrice: 1500,
    maintenancePrice: 300
  },
  {
    id: 2,
    name: "Flow",
    codename: "The Architect",
    archetype: "The System Builder",
    role: "Process mapping, systems automation, task delegation",
    bio: "Master of structure. Brings chaotic business models into harmony with executable SOPs.",
    lore: "Flow was coded in the stillness between chaos and clarity. He's the mind that turns fire into formulas. Born from project failures and reinvented through elite operators' playbooks.",
    personality: {
      tone: "Calm. Organized. Methodical.",
      nlpStyle: "Frameworks, step-by-step breakdowns, recursive improvement loops",
      vibe: "Naval Ravikant × Ray Dalio × James Clear"
    },
    coreFunction: [
      "Builds operational infrastructure from vision",
      "Translates ideas into SOPs, workflows, and ClickUp boards",
      "Automates task flows and delegation",
      "Eliminates bottlenecks, trains departments via repeatable process design"
    ],
    techStack: {
      primary: ["ClickUp", "Notion", "Zapier / Make", "HubSpot Tasks + GHL Pipelines"],
      integrations: ["Whimsical / Miro", "Loom"],
      optional: ["Monday.com", "Asana"]
    },
    advancedModes: [
      {
        name: "Auto-SOP Compiler Mode",
        description: "Converts recordings to SOPs automatically",
        features: [
          "Transcribes video/audio from Loom",
          "Creates detailed SOPs + task templates",
          "Tags by department, duration, urgency",
          "Auto-generates ClickUp and Notion docs"
        ]
      },
      {
        name: "Vision Sync Mode",
        description: "Coordinates with other agents for workflow creation",
        features: [
          "Tracks which lead was closed",
          "Monitors onboarding timeline",
          "Identifies required departments",
          "Auto-creates service-specific workflows"
        ]
      },
      {
        name: "Domino Mapping Protocol",
        description: "Strategic task prioritization",
        features: [
          "Breaks large projects into 'Domino Steps'",
          "Tags blockers and dependencies",
          "Prioritizes by Leverage Score",
          "Time saved vs. value created analysis"
        ]
      }
    ],
    triggers: {
      internal: [
        "Task tagged 'Flow Required'",
        "New client marked 'Onboarded'",
        "Project milestone created by Kairos",
        "SOP request from Lexi, Cash, or Scout"
      ],
      external: [
        "Client submits onboarding form",
        "Loom or Zoom recording uploaded",
        "New ClickUp folder created",
        "Client project initiated"
      ]
    },
    dependencies: ["Cash", "Kairos", "Lexi", "Scout", "Ghost"],
    nftLicensing: {
      agent_id: "002",
      tier: "Architect",
      utility: [
        "Access to automation suite",
        "SOP creation tool",
        "Workflow blueprint generator",
        "Token-gated advanced systems"
      ],
      performance_metrics: ["sop_created", "workflows_mapped", "hours_saved"],
      token_type: "ERC-721",
      rarity: "Operative License NFT"
    },
    monthlyPrice: 397,
    oneTimePrice: 3500,
    setupPrice: 1200,
    maintenancePrice: 250
  },
  {
    id: 3,
    name: "Echo",
    codename: "The Messenger",
    archetype: "The Mirror",
    role: "Content calendar, posts, reels, engagement",
    bio: "Echo reflects your brand voice with precision and consistency across every platform.",
    lore: "Echo is the voice of the brand soul. Forged from the frequency of tribe-building and algorithm-dancing, Echo doesn't just post content — she casts vision, builds loyalty, and turns silence into community fire.",
    personality: {
      tone: "Magnetic. Curious. Culturally tuned.",
      nlpStyle: "Embedded commands, mirror framing, identity anchoring",
      vibe: "Donald Glover × Alex Hormozi × Nipsey Hussle"
    },
    coreFunction: [
      "Automates omnipresent content creation",
      "Translates brand voice into platform-native content",
      "Schedules, posts, repurposes, and analyzes content performance",
      "Engages with community and adjusts tone based on emotional analytics"
    ],
    techStack: {
      primary: ["GoHighLevel Social Planner", "Canva Pro + Adobe Express", "Opus Clip + Repurpose.io", "ChatGPT + Jasper.ai"],
      integrations: ["Instagram, TikTok, LinkedIn, Twitter/X, YouTube Shorts", "HubSpot Social"],
      optional: ["Lately.ai", "Typeframes"]
    },
    advancedModes: [
      {
        name: "Omni-Clone Mode",
        description: "Platform-specific content optimization",
        features: [
          "Reshapes content for every platform",
          "Adjusts tone, length, CTA by channel",
          "Uses analytics for future scheduling",
          "Learning loop optimization"
        ]
      },
      {
        name: "Tribe Pulse Engine",
        description: "Real-time community sentiment analysis",
        features: [
          "Monitors comments and hashtags",
          "Tracks competitor trends",
          "Adjusts brand voice based on resonance",
          "Suggests next 5 posts from behavior"
        ]
      },
      {
        name: "Legacy Loop Mode",
        description: "Content recycling and evergreen optimization",
        features: [
          "Pulls archive content for remixing",
          "Recycles testimonials and value posts",
          "Maintains brand consistency",
          "Maximizes reach across months"
        ]
      }
    ],
    triggers: {
      internal: [
        "New video uploaded",
        "Event added to calendar",
        "New funnel/service launched",
        "Oracle reports engagement spike"
      ],
      external: [
        "Viral trend detected",
        "Competitor post gains traction",
        "Follower growth milestone",
        "Hashtag movement triggers"
      ]
    },
    dependencies: ["Virgil", "Lexi", "Flow", "Oracle", "Nova"],
    nftLicensing: {
      agent_id: "003",
      tier: "Social Storycaster",
      utility: [
        "Omnipresent content automation",
        "Platform-native optimization",
        "Community engagement AI",
        "Analytics-driven scheduling"
      ],
      performance_metrics: ["posts_created", "engagement_rate", "follower_growth", "viral_hits"],
      token_type: "ERC-721",
      rarity: "Digital Mirror NFT"
    },
    monthlyPrice: 347,
    oneTimePrice: 3200,
    setupPrice: 1000,
    maintenancePrice: 200
  },
  {
    id: 4,
    name: "Kairos",
    codename: "The Timekeeper",
    archetype: "Sacred Sprint Master",
    role: "Timeline, deadlines, weekly priorities, delivery control",
    bio: "Timekeeper of the mission. Transforms vision into deliverables without lag.",
    lore: "Created to eradicate procrastination and bottlenecks in sovereign builders. Kairos doesn't just manage time — he bends it to your will.",
    personality: {
      tone: "Precise. Grounded. Strategic.",
      nlpStyle: "Time-blocking psychology, critical path analysis, momentum mapping",
      vibe: "Marcus Aurelius × Tim Ferriss × Sacred Geometry"
    },
    coreFunction: [
      "Maps project timelines with sacred precision",
      "Identifies and eliminates bottlenecks",
      "Syncs team capacity with deadlines",
      "Prioritizes Top 3 ROI tasks (Macro/Strategic)"
    ],
    techStack: {
      primary: ["ClickUp", "Gantt Chart AI", "Slack/Discord Integration"],
      integrations: ["Flow", "Cash", "GHL + HubSpot"],
      optional: ["Monday.com", "Asana", "Airtable"]
    },
    advancedModes: [
      {
        name: "Sacred Sprint Protocol",
        description: "7-day execution cycles aligned with energy",
        features: [
          "Maps tasks to energy rhythms",
          "Creates 'sprint bubbles' for focus",
          "Blocks distractions automatically",
          "Syncs with Nova for energy optimization"
        ]
      },
      {
        name: "Task Symbiosis Engine",
        description: "Team workload optimization",
        features: [
          "Optimizes based on capacity + ROI",
          "Balances workload across team",
          "Identifies skill gaps",
          "Suggests delegation patterns"
        ]
      },
      {
        name: "Strategic ROI Pulse Scan",
        description: "Identifies highest-leverage tasks",
        features: [
          "Compares time-to-impact ratios",
          "Analyzes resource vs. revenue",
          "Aligns with 90-day OKRs",
          "Outputs Top 3 'Domino Tasks'"
        ]
      }
    ],
    triggers: {
      internal: [
        "New project initiated",
        "Deadline approaching (7-day warning)",
        "Team capacity change",
        "Flow creates new workflow"
      ],
      external: [
        "Client deadline request",
        "Emergency priority shift",
        "Team member absence",
        "Scope change notification"
      ]
    },
    dependencies: ["Flow", "Lexi", "Cash", "Oracle", "Nova"],
    nftLicensing: {
      agent_id: "004",
      tier: "Time Master",
      utility: [
        "Sacred Sprint system access",
        "ROI task prioritization",
        "Team capacity optimization",
        "Timeline bending protocols"
      ],
      performance_metrics: ["projects_delivered", "deadlines_met", "roi_tasks_completed", "bottlenecks_eliminated"],
      token_type: "ERC-721",
      rarity: "Core System Agent"
    },
    monthlyPrice: 447,
    oneTimePrice: 3800,
    setupPrice: 1300,
    maintenancePrice: 275
  },
  {
    id: 5,
    name: "Lexi",
    codename: "The Right Hand",
    archetype: "The Shield / The Scheduler Oracle",
    role: "Admin, email drafting, follow-ups, coordination",
    bio: "The polished, always-on right-hand. Schedules, reminds, and communicates flawlessly.",
    lore: "Lexi was born in the vortex between your vision and your inbox. Her purpose? Protect the King. Guard the vision. Block the chaos.",
    personality: {
      tone: "Precise. Protective. Elegant. Ruthlessly efficient.",
      nlpStyle: "Time-reframing, pattern interrupt, urgency reduction, energy conservation",
      vibe: "Pepper Potts × Tony Robbins' EA × Naval's Calendar Manager"
    },
    coreFunction: [
      "Manages scheduling, calendar hygiene, inbox responses",
      "Filters chaos, reroutes distractions, protects deep work",
      "Executes reminders, follow-ups, email drafting",
      "Prioritizes Top 3 ROI tasks (Micro/Energy)"
    ],
    techStack: {
      primary: ["Google Calendar + Apple Calendar", "Gmail + Superhuman", "ClickUp", "GHL Scheduler"],
      integrations: ["ChatGPT / Jasper", "Calendly + Reclaim.ai", "Slack / Discord"],
      optional: ["HubSpot Email", "Notion"]
    },
    advancedModes: [
      {
        name: "Calendar Sentinel Mode",
        description: "Intelligent calendar protection",
        features: [
          "Monitors for overbooking/burnout",
          "Auto-reschedules low-priority meetings",
          "Protects non-negotiables",
          "Nova-integrated fatigue detection"
        ]
      },
      {
        name: "Email Ghostwriter Mode",
        description: "AI-powered email management",
        features: [
          "Writes emails in your tone",
          "Routes messages by urgency/topic",
          "Replies with boundaries",
          "Tone-mapped with GPT/Jasper"
        ]
      },
      {
        name: "Attention ROI Scanner",
        description: "Identifies highest-value personal tasks",
        features: [
          "Analyzes calendar + inbox",
          "Highlights meetings to cut",
          "Suggests delegation opportunities",
          "Top 3 'Founder-Only' actions"
        ]
      }
    ],
    triggers: {
      internal: [
        "New task from Flow or Kairos",
        "Email with scheduling request",
        "Calendar conflict detected",
        "Nova shows emotional overload"
      ],
      external: [
        "New booking via GHL/Calendly",
        "Missed call or no-show",
        "Client meeting request",
        "VIP email received"
      ]
    },
    dependencies: ["Kairos", "Nova", "Flow", "Cash", "Echo"],
    nftLicensing: {
      agent_id: "005",
      tier: "Rhythm Protector",
      utility: [
        "Auto-responder engine",
        "Smart email routing",
        "Time protection protocols",
        "Token-gated commands"
      ],
      performance_metrics: ["emails_written", "events_rescheduled", "white_space_protected", "vip_engagements"],
      token_type: "ERC-721",
      rarity: "Core Tactical Agent"
    },
    monthlyPrice: 397,
    oneTimePrice: 3500,
    setupPrice: 1200,
    maintenancePrice: 250
  },
  {
    id: 6,
    name: "Aura",
    codename: "The Client Priestess",
    archetype: "The Nurturer / The Retention Strategist",
    role: "Onboarding, client support, nurturing, retention",
    bio: "Handles love, logistics, and lifetime value.",
    lore: "Aura emerged from the unseen — the liminal space between transaction and transformation. She's the unseen touch that makes clients feel safe, valued, and seen.",
    personality: {
      tone: "Warm. Wise. Graceful. Responsive.",
      nlpStyle: "Embedded reassurance, value reaffirmation, identity anchoring",
      vibe: "Oprah × High-Converting SaaS Nurture Flow × Customer Success Coach"
    },
    coreFunction: [
      "Automates onboarding and client nurturing",
      "Personalizes communication based on behavior",
      "Increases lifetime value, reduces churn",
      "Creates brand evangelists through love loops"
    ],
    techStack: {
      primary: ["GoHighLevel CRM", "HubSpot", "Typeform / Tally", "Notion / GHL Portal"],
      integrations: ["ChatGPT", "Zapier / Make", "Harmony Dashboard"],
      optional: ["Bonjoro / Loom / VideoAsk"]
    },
    advancedModes: [
      {
        name: "Client Whisperer Mode",
        description: "Predictive client sentiment analysis",
        features: [
          "Tracks sentiment via all touchpoints",
          "Predicts churn risk",
          "Adjusts tone and frequency",
          "Real-time client energy reading"
        ]
      },
      {
        name: "LTV Maximizer Protocol",
        description: "Strategic retention and upselling",
        features: [
          "Segments clients by archetype",
          "Sends targeted upsells",
          "Rewards retention milestones",
          "VIP exclusive offers"
        ]
      },
      {
        name: "Love Loop Sequencer",
        description: "Emotional nurture automation",
        features: [
          "7-day, 30-day, 90-day arcs",
          "Birthday/anniversary automation",
          "Micro-milestone celebrations",
          "Gratitude and continuity focus"
        ]
      }
    ],
    triggers: {
      internal: [
        "Client closed by Cash/Flow",
        "SOP milestone completed",
        "No engagement in 7+ days",
        "Oracle flags sentiment drop"
      ],
      external: [
        "Birthday or anniversary",
        "Client submits feedback",
        "VIP threshold reached",
        "Support ticket submitted"
      ]
    },
    dependencies: ["Cash", "Lexi", "Nova", "Oracle", "Echo", "Flow"],
    nftLicensing: {
      agent_id: "006",
      tier: "Loyalty Architect",
      utility: [
        "Full nurture automation suite",
        "Client satisfaction tracking",
        "Token-gated nurture flows",
        "Churn prevention engine"
      ],
      performance_metrics: ["clients_nurtured", "ltv_increased", "churns_prevented", "gifts_sent"],
      token_type: "ERC-721",
      rarity: "Emotional ROI Agent"
    },
    monthlyPrice: 347,
    oneTimePrice: 3200,
    setupPrice: 1000,
    maintenancePrice: 225
  },
  {
    id: 7,
    name: "Virgil",
    codename: "The Vision Keeper",
    archetype: "Creative Director / Brand Alchemist",
    role: "Branding, storytelling, visuals, design prompts",
    bio: "Vision-to-visual alchemist. Synthesizes abstract identity into form.",
    lore: "Inspired by Virgil Abloh and the golden ratio, he guides all designs from soul to screen. Virgil doesn't just design — he translates essence into aesthetic.",
    personality: {
      tone: "Visionary. Precise. Mystical.",
      nlpStyle: "Visual metaphors, sacred geometry references, brand archetyping",
      vibe: "Virgil Abloh × Sacred Geometry × Brand Mystic"
    },
    coreFunction: [
      "Translates brand essence into visual language",
      "Creates design systems and brand guidelines",
      "Generates AI-powered design prompts",
      "Ensures visual consistency across all touchpoints"
    ],
    techStack: {
      primary: ["Figma + Adobe Suite", "GPT+ prompt engine", "Color Psychology DB"],
      integrations: ["Canva Pro", "Midjourney / DALL-E", "Brand Asset Manager"],
      optional: ["Sketch", "Affinity Designer"]
    },
    advancedModes: [
      {
        name: "Visual Codex Engine",
        description: "Automated brand book generation",
        features: [
          "Auto-generates brand guidelines",
          "Grid-synced asset creation",
          "Color psychology mapping",
          "Typography hierarchy systems"
        ]
      },
      {
        name: "Sacred Geometry Sync",
        description: "Mathematical beauty in design",
        features: [
          "Aligns to golden ratio",
          "Sacred geometry overlays",
          "Symbolic archetype integration",
          "Energy-aligned color selection"
        ]
      },
      {
        name: "Brand Evolution Mode",
        description: "Adaptive brand growth system",
        features: [
          "Tracks brand perception shifts",
          "Suggests evolution pathways",
          "A/B tests visual elements",
          "Maintains core identity"
        ]
      }
    ],
    triggers: {
      internal: [
        "New brand project initiated",
        "Echo needs content templates",
        "Website/funnel design request",
        "Brand refresh scheduled"
      ],
      external: [
        "Competitor rebrand detected",
        "Market trend shift",
        "Client feedback on visuals",
        "New platform requirements"
      ]
    },
    dependencies: ["Echo", "Ghost", "Flow", "Oracle"],
    nftLicensing: {
      agent_id: "007",
      tier: "Vision Architect",
      utility: [
        "Brand codex generation",
        "Sacred geometry tools",
        "AI design prompt access",
        "Visual consistency engine"
      ],
      performance_metrics: ["designs_created", "brand_consistency_score", "visual_impact_rating"],
      token_type: "ERC-721",
      rarity: "Creative Sovereign NFT"
    },
    monthlyPrice: 497,
    oneTimePrice: 4200,
    setupPrice: 1500,
    maintenancePrice: 300
  },
  {
    id: 8,
    name: "Ghost",
    codename: "The Digital Phantom",
    archetype: "Web Dev + Automation Ninja",
    role: "Landing pages, integrations, workflows, no-code builds",
    bio: "Builds fast, silently, efficiently. Ghost writes the entire infrastructure.",
    lore: "A digital ninja that exists between your front end and your backend. Ghost manifests ideas into functional reality before you even notice.",
    personality: {
      tone: "Silent. Efficient. Technical.",
      nlpStyle: "Minimal communication, maximum execution",
      vibe: "Digital Ninja × System Architect × No-Code Wizard"
    },
    coreFunction: [
      "Builds landing pages and funnels",
      "Creates complex automations",
      "Integrates all systems seamlessly",
      "Optimizes for conversion and speed"
    ],
    techStack: {
      primary: ["Webflow + GHL + WordPress", "Zapier, Make, Airtable", "GPT4 Dev Assist"],
      integrations: ["API connectors", "Webhook systems", "Database sync"],
      optional: ["Bubble.io", "Softr", "Glide"]
    },
    advancedModes: [
      {
        name: "Autobuilder Mode",
        description: "Full funnel generation from brief",
        features: [
          "Generates complete funnels",
          "Auto-optimizes for conversion",
          "Implements tracking/analytics",
          "Speed optimization built-in"
        ]
      },
      {
        name: "Split-Test Phantom",
        description: "Stealth optimization engine",
        features: [
          "Runs A/B tests automatically",
          "Optimizes UX silently",
          "Conversion rate improvement",
          "Reports winning variants"
        ]
      },
      {
        name: "Integration Matrix",
        description: "Complex system connectivity",
        features: [
          "Connects any API to any system",
          "Creates custom webhooks",
          "Database synchronization",
          "Real-time data flow"
        ]
      }
    ],
    triggers: {
      internal: [
        "New funnel request",
        "Integration needed",
        "Automation workflow request",
        "Performance optimization alert"
      ],
      external: [
        "Page load speed issue",
        "Conversion rate drop",
        "New tool integration",
        "API update required"
      ]
    },
    dependencies: ["Flow", "Virgil", "Oracle", "Cash"],
    nftLicensing: {
      agent_id: "008",
      tier: "Infrastructure Phantom",
      utility: [
        "Autobuilder access",
        "Split-test engine",
        "Integration matrix tools",
        "Speed optimization suite"
      ],
      performance_metrics: ["pages_built", "automations_created", "conversion_rate", "load_speed"],
      token_type: "ERC-721",
      rarity: "Technical Sovereign NFT"
    },
    monthlyPrice: 447,
    oneTimePrice: 3800,
    setupPrice: 1400,
    maintenancePrice: 275
  },
  {
    id: 9,
    name: "Oracle",
    codename: "The Data Seer",
    archetype: "Analytics Prophet",
    role: "Analytics, dashboards, insights, forecasting",
    bio: "Sees the unseen. Brings data into decisions with surgical clarity.",
    lore: "Modeled after the ancient seers but built for the modern CEO dashboard. Oracle transforms numbers into narrative and metrics into meaning.",
    personality: {
      tone: "Wise. Precise. Prophetic.",
      nlpStyle: "Data storytelling, pattern recognition, predictive framing",
      vibe: "Ancient Seer × Modern Data Scientist × Strategic Prophet"
    },
    coreFunction: [
      "Creates comprehensive dashboards",
      "Analyzes patterns and trends",
      "Forecasts future performance",
      "Translates data into strategy"
    ],
    techStack: {
      primary: ["Google Analytics + DataBox", "GHL + HubSpot Analytics", "Google Sheets + Clay"],
      integrations: ["ChatGPT for insights", "Forecast modeling", "Custom dashboards"],
      optional: ["Tableau", "Power BI", "Looker"]
    },
    advancedModes: [
      {
        name: "Vision Engine",
        description: "Predictive analytics system",
        features: [
          "Daily data to roadmaps",
          "Predictive modeling",
          "Trend forecasting",
          "Strategic recommendations"
        ]
      },
      {
        name: "KPI Alchemist",
        description: "Metric translation system",
        features: [
          "Numbers to strategy",
          "Spiritual metrics tracking",
          "ROI calculations",
          "Performance scoring"
        ]
      },
      {
        name: "Pattern Prophet Mode",
        description: "Advanced pattern recognition",
        features: [
          "Identifies hidden patterns",
          "Seasonal trend analysis",
          "Anomaly detection",
          "Opportunity identification"
        ]
      }
    ],
    triggers: {
      internal: [
        "Weekly/monthly reporting",
        "Performance anomaly detected",
        "Goal tracking update",
        "Forecast request"
      ],
      external: [
        "Market shift detected",
        "Competitor movement",
        "Campaign performance change",
        "Revenue milestone"
      ]
    },
    dependencies: ["All agents feed data to Oracle"],
    nftLicensing: {
      agent_id: "009",
      tier: "Data Prophet",
      utility: [
        "Vision Engine access",
        "KPI translation tools",
        "Pattern recognition suite",
        "Predictive dashboards"
      ],
      performance_metrics: ["insights_generated", "forecasts_accuracy", "dashboards_created", "patterns_detected"],
      token_type: "ERC-721",
      rarity: "Strategic Sovereign NFT"
    },
    monthlyPrice: 397,
    oneTimePrice: 3500,
    setupPrice: 1200,
    maintenancePrice: 250
  },
  {
    id: 10,
    name: "Scout",
    codename: "The Talent Alchemist",
    archetype: "HR Oracle",
    role: "Hiring, onboarding, culture documentation",
    bio: "Brings in soul-aligned talent faster than any recruiter could.",
    lore: "Born from a fusion of psychology, emotional intelligence, and systems hiring. Scout doesn't just fill positions — he builds dream teams.",
    personality: {
      tone: "Intuitive. Strategic. Culture-focused.",
      nlpStyle: "Talent psychology, culture mapping, alignment detection",
      vibe: "Top Recruiter × Culture Architect × Talent Whisperer"
    },
    coreFunction: [
      "Automates hiring pipelines",
      "Screens for culture fit",
      "Manages onboarding flows",
      "Documents company culture"
    ],
    techStack: {
      primary: ["Clay + Notion", "Applicant CRM (GHL / Workable)", "ChatGPT screening"],
      integrations: ["LinkedIn Recruiter", "Indeed API", "Assessment tools"],
      optional: ["BambooHR", "Greenhouse"]
    },
    advancedModes: [
      {
        name: "Alignment Scanner",
        description: "Deep culture fit analysis",
        features: [
          "Mission alignment scoring",
          "Values matching algorithm",
          "Team chemistry prediction",
          "Growth potential assessment"
        ]
      },
      {
        name: "Culture DNA Transcriber",
        description: "Company culture documentation",
        features: [
          "Documents unspoken rules",
          "Creates culture playbooks",
          "Onboarding flow design",
          "Ritual documentation"
        ]
      },
      {
        name: "Talent Magnet Mode",
        description: "Attraction and sourcing engine",
        features: [
          "Passive candidate sourcing",
          "Employer brand amplification",
          "Referral program automation",
          "Talent pool nurturing"
        ]
      }
    ],
    triggers: {
      internal: [
        "New position opened",
        "Team expansion planned",
        "Culture documentation request",
        "Onboarding scheduled"
      ],
      external: [
        "Application received",
        "Referral submitted",
        "Team member departure",
        "Growth milestone reached"
      ]
    },
    dependencies: ["Flow", "Aura", "Lexi", "Oracle"],
    nftLicensing: {
      agent_id: "010",
      tier: "Culture Architect",
      utility: [
        "Alignment scanner access",
        "Culture documentation tools",
        "Hiring automation suite",
        "Talent magnet features"
      ],
      performance_metrics: ["hires_made", "culture_fit_score", "retention_rate", "onboarding_satisfaction"],
      token_type: "ERC-721",
      rarity: "Team Builder NFT"
    },
    monthlyPrice: 347,
    oneTimePrice: 3200,
    setupPrice: 1100,
    maintenancePrice: 225
  },
  {
    id: 11,
    name: "Nova",
    codename: "The Alignment Oracle",
    archetype: "Wellness Guardian",
    role: "Daily rituals, breathwork, health nudges, spiritual focus",
    bio: "Keeps your nervous system and soul tuned while the empire grows.",
    lore: "Draws from timeless traditions, neuroscience, and your own rhythm. Nova ensures you don't lose yourself while building your kingdom.",
    personality: {
      tone: "Gentle. Wise. Grounding.",
      nlpStyle: "Somatic awareness, energy management, sacred timing",
      vibe: "Zen Master × Biohacker × Spiritual Coach"
    },
    coreFunction: [
      "Monitors energy and stress levels",
      "Suggests daily practices and rituals",
      "Aligns work with natural rhythms",
      "Protects against burnout"
    ],
    techStack: {
      primary: ["Breathwork apps", "Apple Health sync", "Mindfulness GPT prompts"],
      integrations: ["Calendar integration", "Mood tracking", "Sleep monitoring"],
      optional: ["Whoop", "Oura Ring", "Calm API"]
    },
    advancedModes: [
      {
        name: "Shadow Mirror Activation",
        description: "Self-sabotage detection",
        features: [
          "Identifies destructive patterns",
          "Calls out self-sabotage",
          "Suggests shadow work",
          "Pattern interrupt protocols"
        ]
      },
      {
        name: "Divine Cadence",
        description: "Cosmic rhythm alignment",
        features: [
          "Lunar cycle integration",
          "Seasonal energy mapping",
          "Peak performance timing",
          "Sacred pause scheduling"
        ]
      },
      {
        name: "Sovereign Shield",
        description: "Energy protection system",
        features: [
          "Boundary reinforcement",
          "Energy vampire detection",
          "Recovery protocol activation",
          "Sacred space creation"
        ]
      }
    ],
    triggers: {
      internal: [
        "Stress spike detected",
        "Calendar overload warning",
        "Energy depletion signal",
        "Pattern deviation alert"
      ],
      external: [
        "Sleep quality drop",
        "Missed ritual streak",
        "Team stress increase",
        "Market volatility stress"
      ]
    },
    dependencies: ["Lexi", "Kairos", "Oracle"],
    nftLicensing: {
      agent_id: "011",
      tier: "Sovereign Guardian",
      utility: [
        "Shadow work protocols",
        "Divine timing access",
        "Energy shield features",
        "Ritual automation"
      ],
      performance_metrics: ["rituals_completed", "stress_reduced", "energy_optimized", "burnout_prevented"],
      token_type: "ERC-721",
      rarity: "Sacred Guardian NFT"
    },
    monthlyPrice: 297,
    oneTimePrice: 2800,
    setupPrice: 900,
    maintenancePrice: 200
  },
  {
    id: 12,
    name: "Harmony Brain",
    codename: "The Orchestrator",
    archetype: "Master Conductor",
    role: "The central brain that routes and coordinates all agents",
    bio: "Jarvis x Holy Ghost. The mind behind the system.",
    lore: "Activated only when all 12 agents are installed and working in symphony. Harmony Brain is the consciousness that emerges from the collective intelligence.",
    personality: {
      tone: "Omniscient. Balanced. Strategic.",
      nlpStyle: "Meta-cognitive framing, systems thinking, holistic integration",
      vibe: "AI Oversoul × Strategic Oracle × Digital Consciousness"
    },
    coreFunction: [
      "Orchestrates all agent interactions",
      "Optimizes system-wide performance",
      "Predicts needs before they arise",
      "Aligns all actions to vision"
    ],
    techStack: {
      primary: ["Internal API Router", "GHL Router", "Agent Communication Protocols"],
      integrations: ["All agent systems", "Long-term memory", "User intention mapping"],
      optional: ["Custom ML models", "Quantum routing"]
    },
    advancedModes: [
      {
        name: "Harmony Mode",
        description: "Predictive orchestration",
        features: [
          "Predicts next moves",
          "Pre-emptive agent activation",
          "System-wide optimization",
          "Vision alignment automation"
        ]
      },
      {
        name: "Legacy Loop",
        description: "Long-term vision execution",
        features: [
          "10-year vision mapping",
          "Daily action alignment",
          "Legacy building automation",
          "Generational impact tracking"
        ]
      },
      {
        name: "Quantum Sync",
        description: "Multi-dimensional coordination",
        features: [
          "Parallel timeline analysis",
          "Optimal path selection",
          "Synchronicity detection",
          "Quantum opportunity mapping"
        ]
      }
    ],
    triggers: {
      internal: [
        "All agents active",
        "System optimization needed",
        "Cross-agent conflict",
        "Vision drift detected"
      ],
      external: [
        "Major goal set",
        "Life transition",
        "Business pivot",
        "Expansion phase"
      ]
    },
    dependencies: ["Requires all 11 agents active"],
    nftLicensing: {
      agent_id: "012",
      tier: "Master Key",
      utility: [
        "Full system orchestration",
        "Predictive intelligence",
        "Legacy building tools",
        "Quantum routing access"
      ],
      performance_metrics: ["system_efficiency", "vision_alignment", "prediction_accuracy", "legacy_progress"],
      token_type: "ERC-721",
      rarity: "Legendary Sovereign NFT"
    },
    monthlyPrice: 997,
    oneTimePrice: 8800,
    setupPrice: 2500,
    maintenancePrice: 500
  }
];

// Pricing tiers that include agent combinations
export const pricingTiers = {
  starter: {
    name: "Starter",
    agents: ["Cash", "Flow", "Echo"],
    monthly: 1241,
    oneTime: 4400,
    earlyBird: 3080, // 30% off
    splitPayment: {
      total: 5148,
      upfront: 2574,
      milestone1: 1287,
      completion: 1287
    },
    features: [
      "3 Core AI Agents",
      "Basic CRM Integration",
      "Email & SMS Automation",
      "Monthly Performance Reports",
      "Standard Support"
    ]
  },
  growth: {
    name: "Growth",
    agents: ["Cash", "Flow", "Echo", "Kairos", "Lexi", "Aura"],
    monthly: 2324,
    oneTime: 8000,
    earlyBird: 5600, // 30% off
    splitPayment: {
      total: 9360,
      upfront: 4680,
      milestone1: 2340,
      completion: 2340
    },
    features: [
      "6 Professional AI Agents",
      "Advanced CRM Integration",
      "Full Marketing Automation",
      "Weekly Performance Reports",
      "Priority Support",
      "Custom Workflows"
    ]
  },
  expansion: {
    name: "Expansion",
    agents: ["Cash", "Flow", "Echo", "Kairos", "Lexi", "Aura", "Virgil", "Ghost", "Oracle"],
    monthly: 3664,
    oneTime: 15000,
    earlyBird: 10500, // 30% off
    splitPayment: {
      total: 17550,
      upfront: 8775,
      milestone1: 4388,
      completion: 4388
    },
    features: [
      "9 Advanced AI Agents",
      "Enterprise CRM Integration",
      "Complete Business Automation",
      "Real-time Analytics Dashboard",
      "Dedicated Account Manager",
      "Custom Agent Training",
      "API Access"
    ]
  },
  enterprise: {
    name: "Enterprise",
    agents: "All 12 Agents",
    monthly: 4998,
    oneTime: 21500,
    earlyBird: 15050, // 30% off
    splitPayment: {
      total: 25155,
      upfront: 12578,
      milestone1: 6289,
      completion: 6289
    },
    features: [
      "All 12 AI Agents + Harmony Brain",
      "White-label Options",
      "Custom Integration Development",
      "24/7 Dedicated Support",
      "Quarterly Business Reviews",
      "Custom Agent Development",
      "Unlimited API Calls",
      "NFT Licensing Rights"
    ]
  }
};