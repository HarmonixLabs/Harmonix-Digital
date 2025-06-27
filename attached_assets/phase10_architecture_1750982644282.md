# HARMONIX Phase 10 Implementation Architecture Design

## Introduction

This document provides a comprehensive architectural design for implementing Phase 10 of the HARMONIX platform, focusing on the critical user conversion flow from demo users to paid subscribers. The architecture encompasses frontend components, backend services, external integrations, and self-healing mechanisms that will enable the platform to operate reliably at scale while providing seamless user experiences.

The design follows modern software architecture principles including separation of concerns, scalability, maintainability, and security. Each component is designed to work independently while maintaining strong integration points that ensure data consistency and system reliability.

## System Architecture Overview

The Phase 10 implementation introduces several new architectural components that integrate with the existing HARMONIX infrastructure. The system follows a microservices-inspired approach where each major functionality area operates as a distinct service while sharing common infrastructure components.

### Core Architectural Principles

The architecture is built upon several fundamental principles that guide all design decisions. Modularity ensures that each component can be developed, tested, and deployed independently, reducing the risk of system-wide failures and enabling parallel development efforts. Scalability considerations are embedded throughout the design, allowing the system to handle increasing user loads without significant architectural changes.

Security is implemented as a cross-cutting concern, with authentication, authorization, and data protection mechanisms integrated at every layer. The principle of fail-safe defaults ensures that any component failure results in a secure state rather than exposing sensitive data or functionality.

Observability is built into the architecture from the ground up, with comprehensive logging, monitoring, and alerting capabilities that enable proactive issue detection and resolution. This supports the self-healing requirements by providing the data necessary for automated recovery mechanisms.

### Component Interaction Model

The Phase 10 components interact through well-defined interfaces that maintain loose coupling while ensuring strong consistency where required. The Trial Signup Modal serves as the primary user interface for conversion, communicating with the authentication service through standardized API calls.

The authentication service acts as the central orchestrator for user conversion, coordinating with the database, CRM, and payment systems to ensure atomic operations. This prevents partial conversions that could leave the system in an inconsistent state.

External integrations with GoHighLevel and Stripe are abstracted through dedicated service layers that handle API communication, error recovery, and rate limiting. This abstraction allows the core business logic to remain independent of external service implementation details.

## Frontend Architecture Design

### Trial Signup Modal Component

The Trial Signup Modal represents a critical user interface component that must balance user experience with technical robustness. The component is designed as a self-contained React component that can be easily integrated into any page of the application while maintaining consistent behavior and styling.

The modal follows a progressive disclosure pattern, presenting users with a clear, step-by-step process that reduces cognitive load while collecting necessary information. The design incorporates real-time validation feedback, ensuring users understand any input errors immediately rather than after form submission.

State management within the component utilizes React hooks to maintain form state, validation status, and submission progress. This approach ensures that the component remains responsive during network operations while providing clear feedback about the current operation status.

The component implements comprehensive error handling that gracefully manages both client-side validation errors and server-side processing failures. Error messages are user-friendly while providing sufficient detail for users to understand and correct issues.

Accessibility is a primary consideration in the component design, with proper ARIA labels, keyboard navigation support, and screen reader compatibility. The modal can be operated entirely through keyboard navigation, ensuring compliance with accessibility standards.

### Form Validation Architecture

The validation system implements a multi-layered approach that provides immediate feedback while ensuring data integrity. Client-side validation offers real-time feedback as users interact with form fields, preventing common input errors before form submission.

Email validation includes both format checking and domain verification to reduce invalid email addresses in the system. Password validation enforces security requirements while providing clear guidance about password strength requirements.

Phone number validation includes format standardization and basic validity checking, ensuring consistent data storage while accommodating international number formats. The validation system is designed to be extensible, allowing for additional validation rules as requirements evolve.

Server-side validation provides the final layer of data integrity checking, ensuring that all data meets business requirements regardless of client-side validation status. This approach protects against malicious clients while providing a consistent validation experience.

### State Management Integration

The Trial Signup Modal integrates with the existing application state management system to ensure consistent user experience across the platform. The component updates the global authentication state upon successful registration, eliminating the need for page refreshes or manual state synchronization.

The integration maintains the existing demo session context while transitioning to authenticated user status, preserving any work or preferences the user has established during their demo experience. This continuity is crucial for maintaining user engagement during the conversion process.

Error states are managed consistently with the rest of the application, ensuring that users receive familiar error messaging and recovery options. The state management system includes provisions for handling network failures and partial registration states.

## Backend Service Architecture

### Authentication and Registration Service

The authentication service represents the core of the user conversion process, orchestrating multiple operations to ensure atomic user registration. The service is designed as a stateless component that can be horizontally scaled to handle increasing registration volumes.

The service implements a transaction-based approach to user registration, ensuring that all operations either complete successfully or are rolled back entirely. This prevents partial registrations that could leave users in an inconsistent state between systems.

Database operations are optimized for performance while maintaining data consistency. The service uses connection pooling and prepared statements to minimize database overhead while ensuring secure data handling.

The service includes comprehensive audit logging that tracks all registration attempts, successful conversions, and error conditions. This logging provides valuable data for monitoring system performance and identifying potential issues.

### User Data Management

User data management follows strict privacy and security guidelines, implementing encryption for sensitive data and access controls that limit data exposure to authorized operations only. The system maintains separate storage for demo data and production user data, ensuring clear data lifecycle management.

The user model is designed to accommodate the transition from demo user to registered user while maintaining referential integrity across all system components. This includes updating foreign key relationships and maintaining audit trails for compliance purposes.

Data validation at the service layer ensures that all user information meets business requirements and regulatory compliance standards. The validation system is configurable, allowing for different validation rules based on user type or geographic location.

### API Design and Documentation

The registration API follows RESTful design principles with clear, predictable endpoints that are easy to integrate and maintain. The API includes comprehensive input validation and standardized error responses that provide meaningful feedback to client applications.

API versioning is implemented to ensure backward compatibility as the system evolves. The current implementation includes provisions for future API versions without breaking existing integrations.

Rate limiting is implemented at the API level to prevent abuse while ensuring legitimate users can complete registration without interference. The rate limiting system includes provisions for different limits based on user type and source IP address.

## External Integration Architecture

### GoHighLevel CRM Integration

The GoHighLevel integration is designed as a dedicated service layer that abstracts the complexity of CRM operations from the core business logic. This service handles all aspects of CRM communication including authentication, request formatting, response parsing, and error handling.

The integration implements a retry mechanism with exponential backoff to handle temporary API failures gracefully. This ensures that transient network issues or CRM service interruptions do not result in failed user registrations.

Contact creation and tagging operations are designed to be idempotent, allowing for safe retry operations without creating duplicate records or inconsistent tag states. The service maintains a local cache of CRM operations to support this idempotency.

The integration includes comprehensive logging of all CRM operations, providing visibility into the success and failure rates of external API calls. This data is crucial for monitoring the health of the integration and identifying potential issues before they impact users.

### Stripe Payment Integration

The Stripe integration follows security best practices for handling payment information, ensuring that sensitive payment data never touches the application servers directly. The integration uses Stripe's secure tokenization system to maintain PCI compliance while providing necessary payment functionality.

Subscription creation is implemented with careful consideration of trial period management and automatic billing transitions. The system creates subscriptions with appropriate trial periods while ensuring that billing information is properly configured for automatic conversion.

The integration includes comprehensive error handling for payment failures, expired cards, and other common payment issues. Error responses are translated into user-friendly messages while maintaining sufficient detail for customer support operations.

Webhook processing is designed to handle Stripe's eventual consistency model, ensuring that payment status updates are processed correctly even when they arrive out of order or are delayed.

### API Rate Limiting and Error Handling

Both external integrations implement sophisticated rate limiting strategies that respect the API limits of external services while maximizing throughput. The rate limiting system includes provisions for burst capacity and priority queuing for critical operations.

Error handling follows a hierarchical approach where different error types receive appropriate responses. Temporary errors trigger retry mechanisms, while permanent errors are logged and reported without retry attempts.

The integration services include circuit breaker patterns that prevent cascading failures when external services become unavailable. When circuit breakers are triggered, the system gracefully degrades functionality while maintaining core operations.

## Database Architecture and Data Flow

### User Data Model Evolution

The database schema is designed to support the evolution of users from demo status to registered users while maintaining data integrity and audit trails. The user table includes status fields that track the user's current state and conversion history.

Foreign key relationships are carefully managed during user conversion to ensure that demo data is properly associated with the converted user account. This includes updating references in chat logs, agent interactions, and preference settings.

The schema includes provisions for soft deletion of demo data, allowing for data retention policies while maintaining system performance. Cleanup operations are designed to be performed during low-traffic periods to minimize impact on active users.

### Transaction Management

All user conversion operations are wrapped in database transactions that ensure atomicity across multiple table updates. The transaction design includes proper isolation levels to prevent race conditions during concurrent registration attempts.

Deadlock detection and resolution mechanisms are implemented to handle concurrent access patterns gracefully. The system includes retry logic for deadlock situations while maintaining data consistency.

Transaction logging provides detailed audit trails for all database operations, supporting both debugging efforts and compliance requirements. The logging system is designed to be performant while providing comprehensive coverage.

### Data Consistency and Integrity

Referential integrity constraints ensure that user data remains consistent across all system components. The database schema includes appropriate foreign key constraints and check constraints that prevent invalid data states.

Data validation at the database level provides the final layer of integrity checking, ensuring that business rules are enforced regardless of application logic changes. This includes constraints on user status transitions and required field validation.

The system includes automated data consistency checking that runs during maintenance windows to identify and report any data integrity issues. These checks provide early warning of potential problems before they impact users.

## Webhook Processing Architecture

### Stripe Webhook Handler

The Stripe webhook handler is designed as a dedicated service that processes payment-related events with high reliability and performance. The handler implements proper webhook verification to ensure that only legitimate Stripe events are processed.

Event processing is designed to be idempotent, allowing for safe retry operations when webhook delivery fails or is delayed. The system maintains a record of processed events to prevent duplicate processing while supporting replay capabilities for debugging.

The webhook handler includes comprehensive error handling that distinguishes between temporary processing failures and permanent errors. Temporary failures trigger retry mechanisms while permanent errors are logged and reported for manual investigation.

Event ordering is carefully managed to ensure that payment status updates are processed in the correct sequence. The system includes provisions for handling out-of-order events while maintaining data consistency.

### Event Processing Pipeline

The webhook processing pipeline is designed for high throughput and reliability, with provisions for handling large volumes of events during peak periods. The pipeline includes queuing mechanisms that smooth out traffic spikes while ensuring timely processing.

Event validation ensures that all incoming webhooks contain the required data and meet format requirements before processing begins. Invalid events are logged and rejected without impacting the processing of valid events.

The pipeline includes monitoring and alerting capabilities that provide real-time visibility into webhook processing performance. This includes metrics on processing times, error rates, and queue depths.

### CRM Update Coordination

Webhook processing includes coordination with CRM updates to ensure that user status changes are reflected consistently across all systems. This coordination includes retry mechanisms for CRM API failures and consistency checking to verify successful updates.

The system maintains a record of CRM update attempts and their outcomes, providing audit trails for customer support and debugging purposes. This includes tracking of tag applications and contact status changes.

Conflict resolution mechanisms handle cases where webhook events and direct CRM updates might conflict, ensuring that the most recent and authoritative data is maintained across all systems.

## Self-Healing System Design

### Health Monitoring Infrastructure

The health monitoring system provides comprehensive visibility into all aspects of the HARMONIX platform, including application performance, database health, external service availability, and user experience metrics. The monitoring infrastructure is designed to detect issues before they impact users while providing detailed diagnostic information for rapid resolution.

Application health checks include both shallow and deep health verification. Shallow checks verify that services are responding to requests, while deep checks validate that all dependencies are available and functioning correctly. This multi-layered approach ensures that health status accurately reflects the system's ability to serve users.

Database monitoring includes connection pool status, query performance metrics, and data consistency checks. The monitoring system tracks both real-time performance and historical trends to identify potential issues before they become critical.

External service monitoring tracks the availability and performance of integrations with GoHighLevel, Stripe, and other external dependencies. This monitoring includes both API response times and error rates, providing early warning of integration issues.

### Automated Recovery Mechanisms

The self-healing system implements automated recovery mechanisms that can resolve common issues without human intervention. These mechanisms are designed to be conservative, ensuring that automated actions do not cause additional problems while resolving the original issue.

Service restart capabilities include intelligent restart logic that considers the current system load and user impact before initiating restart operations. The system includes provisions for graceful shutdowns that complete in-flight operations before restarting services.

Database connection recovery includes automatic reconnection logic with exponential backoff to handle temporary database unavailability. The system maintains connection pools that can recover from network interruptions without losing application state.

Circuit breaker mechanisms protect the system from cascading failures by temporarily disabling failing components while they recover. The circuit breaker system includes automatic reset capabilities that restore service when health checks indicate recovery.

### Alerting and Escalation

The alerting system provides tiered notifications that ensure appropriate personnel are notified of issues based on severity and impact. Critical alerts that indicate user-impacting issues are escalated immediately, while warning-level alerts are batched and sent during business hours.

Alert fatigue prevention mechanisms ensure that notifications remain actionable by filtering duplicate alerts and providing clear resolution guidance. The system includes provisions for alert acknowledgment and escalation when issues are not resolved within defined timeframes.

Integration with communication platforms ensures that alerts reach the appropriate team members regardless of their location or current activity. The system supports multiple notification channels including email, SMS, and chat platforms.

## Performance and Scalability Considerations

### Load Balancing and Distribution

The architecture includes provisions for horizontal scaling of all major components, ensuring that the system can handle increasing user loads without degrading performance. Load balancing is implemented at multiple layers, including web servers, application services, and database connections.

Session affinity is carefully managed to ensure that user sessions remain consistent while allowing for load distribution across multiple server instances. The system includes provisions for session failover when server instances become unavailable.

Geographic distribution capabilities allow for deployment across multiple regions to reduce latency for users in different locations. The architecture includes provisions for data synchronization and consistency across distributed deployments.

### Caching Strategy

The caching strategy implements multiple layers of caching to optimize performance while maintaining data consistency. Application-level caching reduces database load for frequently accessed data, while HTTP caching improves response times for static content.

Cache invalidation mechanisms ensure that cached data remains consistent with the underlying data sources. The system includes provisions for both time-based and event-based cache invalidation to balance performance with data freshness.

Distributed caching capabilities allow for cache sharing across multiple application instances, improving cache hit rates while reducing memory requirements on individual servers.

### Database Optimization

Database optimization includes query optimization, index management, and connection pooling to ensure optimal performance under varying load conditions. The system includes provisions for read replicas to distribute query load while maintaining data consistency.

Query performance monitoring identifies slow queries and provides recommendations for optimization. The system includes automated index analysis that suggests new indexes based on query patterns.

Connection pooling is optimized for the expected load patterns, with provisions for dynamic pool sizing based on current demand. The system includes monitoring of connection pool utilization to identify potential bottlenecks.

## Security Architecture

### Authentication and Authorization

The security architecture implements comprehensive authentication and authorization mechanisms that protect user data while providing seamless user experiences. Multi-factor authentication capabilities are included for enhanced security when required.

Token-based authentication uses JWT tokens with appropriate expiration times and refresh mechanisms. The token system includes provisions for token revocation and blacklisting to handle security incidents.

Role-based access control ensures that users can only access functionality and data appropriate to their account type and permissions. The authorization system is designed to be extensible, allowing for new roles and permissions as the platform evolves.

### Data Protection

Data protection mechanisms include encryption at rest and in transit for all sensitive user information. The encryption system uses industry-standard algorithms and key management practices to ensure data security.

Personal data handling follows GDPR and other privacy regulations, with provisions for data export, deletion, and consent management. The system includes audit trails for all data access and modification operations.

Input validation and sanitization prevent injection attacks and other common security vulnerabilities. The validation system is applied at multiple layers to ensure comprehensive protection.

### Compliance and Auditing

The system includes comprehensive audit logging that tracks all user actions, system operations, and administrative activities. Audit logs are designed to be tamper-evident and are stored securely with appropriate retention policies.

Compliance reporting capabilities provide the data necessary for regulatory compliance and security audits. The system includes provisions for automated compliance checking and reporting.

Security monitoring includes intrusion detection and anomaly detection capabilities that identify potential security threats. The monitoring system integrates with the alerting infrastructure to ensure rapid response to security incidents.

## Conclusion

The Phase 10 implementation architecture provides a robust foundation for converting demo users to paid subscribers while maintaining the high standards of reliability, security, and performance that users expect from the HARMONIX platform. The architecture balances complexity with maintainability, ensuring that the system can evolve to meet future requirements while remaining stable and secure.

The self-healing capabilities embedded throughout the architecture ensure that the system can maintain high availability even when individual components experience issues. This resilience is crucial for maintaining user trust and ensuring business continuity.

The comprehensive monitoring and alerting systems provide the visibility necessary for proactive system management, enabling the operations team to identify and resolve issues before they impact users. This proactive approach is essential for maintaining the platform's reputation for reliability and performance.


## API Specifications and Data Flow Documentation

### Trial Signup Modal API Specification

The Trial Signup Modal communicates with the backend through a well-defined API that ensures secure and reliable user registration. The API endpoint accepts user registration data and orchestrates the complex process of converting demo users to registered trial users.

**Endpoint:** `POST /api/auth/register`

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <demo_token> (if applicable)
X-Demo-Session-ID: <session_id> (for demo user conversion)
```

**Request Body Schema:**
```json
{
  "name": {
    "type": "string",
    "required": true,
    "minLength": 2,
    "maxLength": 100,
    "pattern": "^[a-zA-Z\\s'-]+$"
  },
  "email": {
    "type": "string",
    "required": true,
    "format": "email",
    "maxLength": 255
  },
  "phone": {
    "type": "string",
    "required": true,
    "pattern": "^\\+?[1-9]\\d{1,14}$"
  },
  "password": {
    "type": "string",
    "required": true,
    "minLength": 8,
    "maxLength": 128,
    "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+"
  },
  "acceptTerms": {
    "type": "boolean",
    "required": true,
    "const": true
  },
  "marketingConsent": {
    "type": "boolean",
    "required": false,
    "default": false
  }
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "status": "trial",
      "trialEndsAt": "2024-01-15T00:00:00Z",
      "createdAt": "2024-01-08T12:00:00Z"
    },
    "token": "jwt_token_string",
    "subscription": {
      "id": "stripe_subscription_id",
      "status": "trialing",
      "trialEnd": "2024-01-15T00:00:00Z"
    }
  },
  "message": "Registration successful. Welcome to your 7-day free trial!"
}
```

**Error Response Examples:**

*Validation Error (400 Bad Request):*
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email address is already registered"],
      "password": ["Password must contain at least one uppercase letter"]
    }
  }
}
```

*External Service Error (503 Service Unavailable):*
```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_SERVICE_ERROR",
    "message": "Registration temporarily unavailable. Please try again in a few minutes.",
    "retryAfter": 300
  }
}
```

### GoHighLevel CRM Integration Specification

The GoHighLevel integration wrapper provides a clean interface for CRM operations while handling the complexity of external API communication, rate limiting, and error recovery.

**Service Interface:**
```javascript
class GHLService {
  async createContact(contactData) {
    // Creates a new contact in GoHighLevel
    // Returns: { contactId, success, error }
  }
  
  async tagContact(contactId, tags) {
    // Applies tags to an existing contact
    // Returns: { success, appliedTags, error }
  }
  
  async updateContact(contactId, updateData) {
    // Updates contact information
    // Returns: { success, updatedFields, error }
  }
  
  async getContact(contactId) {
    // Retrieves contact information
    // Returns: { contact, success, error }
  }
}
```

**Contact Creation Data Flow:**

1. **Input Validation:** Validate contact data against GHL requirements
2. **API Request Formation:** Format data according to GHL API specification
3. **Rate Limiting Check:** Ensure request complies with API rate limits
4. **API Call Execution:** Send request to GHL with proper authentication
5. **Response Processing:** Parse response and extract contact ID
6. **Error Handling:** Process any errors and determine retry strategy
7. **Result Return:** Return standardized response to calling service

**Tag Application Process:**

The tag application process ensures that user segmentation is maintained consistently across the CRM system. Tags are applied atomically to prevent partial tag states that could impact marketing automation workflows.

Tag validation ensures that only predefined tags are applied, preventing typos or unauthorized tags from entering the system. The validation system includes provisions for tag hierarchies and mutually exclusive tag groups.

Bulk tag operations are optimized to minimize API calls while maintaining individual tag application audit trails. The system includes provisions for tag removal and tag history tracking.

### Stripe Payment Integration Specification

The Stripe integration handles all aspects of subscription management, from initial trial creation through payment processing and subscription lifecycle management.

**Service Interface:**
```javascript
class StripeService {
  async createCustomer(customerData) {
    // Creates a new Stripe customer
    // Returns: { customerId, success, error }
  }
  
  async createTrialSubscription(customerId, planId) {
    // Creates a subscription with trial period
    // Returns: { subscriptionId, trialEnd, success, error }
  }
  
  async updateSubscription(subscriptionId, updateData) {
    // Updates subscription parameters
    // Returns: { subscription, success, error }
  }
  
  async cancelSubscription(subscriptionId, options) {
    // Cancels a subscription with specified options
    // Returns: { cancellation, success, error }
  }
}
```

**Trial Subscription Creation Flow:**

1. **Customer Validation:** Verify customer data and check for existing accounts
2. **Payment Method Setup:** Configure payment method for post-trial billing
3. **Subscription Creation:** Create subscription with appropriate trial period
4. **Webhook Configuration:** Ensure webhook endpoints are properly configured
5. **Trial Period Calculation:** Set trial end date based on business rules
6. **Confirmation Processing:** Send confirmation and setup completion notifications

**Payment Processing Architecture:**

The payment processing system is designed to handle the complexity of subscription billing while maintaining PCI compliance and providing excellent user experience. The system uses Stripe's secure tokenization to ensure that sensitive payment data never touches the application servers.

Subscription lifecycle management includes handling of trial expiration, payment failures, dunning management, and voluntary cancellations. Each lifecycle event triggers appropriate actions in both the application and CRM systems.

Payment retry logic implements intelligent retry strategies that maximize successful payments while minimizing user friction. The system includes provisions for different retry strategies based on failure type and customer history.

### Webhook Processing Data Flow

The webhook processing system handles real-time updates from external services, ensuring that the application state remains synchronized with external systems even when network conditions or service availability varies.

**Webhook Verification Process:**

1. **Signature Validation:** Verify webhook signature using shared secret
2. **Timestamp Checking:** Ensure webhook is recent to prevent replay attacks
3. **Event Deduplication:** Check for duplicate events using event IDs
4. **Schema Validation:** Validate event data against expected schema
5. **Processing Queue:** Add valid events to processing queue
6. **Acknowledgment:** Send acknowledgment to webhook sender

**Event Processing Pipeline:**

The event processing pipeline is designed for high reliability and performance, with provisions for handling large volumes of events during peak periods. The pipeline includes multiple processing stages that can be scaled independently based on load requirements.

Event ordering is managed through a combination of timestamps and sequence numbers, ensuring that events are processed in the correct order even when they arrive out of sequence. The system includes provisions for handling missing events and event gaps.

Error handling in the pipeline distinguishes between transient and permanent errors, applying appropriate retry strategies for each type. Transient errors trigger exponential backoff retry mechanisms, while permanent errors are logged and reported for manual investigation.

**CRM Synchronization Logic:**

Webhook events that require CRM updates are processed through a dedicated synchronization service that ensures consistency between the application database and the CRM system. This service handles the complexity of mapping application events to CRM operations.

Conflict resolution mechanisms handle cases where webhook events and direct CRM updates might create inconsistent states. The system maintains authoritative data sources for different types of information and resolves conflicts based on predefined precedence rules.

Audit trails for CRM synchronization provide detailed records of all synchronization operations, including the source event, CRM operation performed, and the result. This audit information is crucial for debugging synchronization issues and maintaining data integrity.

## Database Schema and Migration Strategy

### User Table Evolution

The user table schema is designed to support the evolution from demo users to registered users while maintaining data integrity and supporting efficient queries. The schema includes provisions for user status tracking, trial management, and external system integration.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'demo',
  demo_session_id VARCHAR(100),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  ghl_contact_id VARCHAR(100),
  marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_status CHECK (status IN ('demo', 'trial', 'active', 'cancelled', 'expired')),
  CONSTRAINT trial_end_required CHECK (
    (status = 'trial' AND trial_ends_at IS NOT NULL) OR 
    (status != 'trial')
  )
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_demo_session ON users(demo_session_id);
CREATE INDEX idx_users_trial_ends ON users(trial_ends_at) WHERE status = 'trial';
```

**Migration Strategy:**

The migration strategy ensures that existing demo users can be seamlessly converted to the new schema without data loss or service interruption. The migration includes provisions for data validation and rollback capabilities.

Migration scripts are designed to be idempotent, allowing for safe re-execution if migration failures occur. The scripts include comprehensive validation checks that verify data integrity before and after migration operations.

Rollback procedures are documented and tested to ensure that migrations can be reversed if issues are discovered after deployment. The rollback procedures include data restoration and schema reversion capabilities.

### Audit and Logging Tables

Comprehensive audit logging is implemented through dedicated tables that track all significant user actions and system operations. The audit system is designed to be performant while providing complete coverage of security-relevant events.

```sql
CREATE TABLE user_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_action CHECK (action IN (
    'registration', 'login', 'logout', 'password_change',
    'trial_start', 'trial_end', 'subscription_start',
    'subscription_cancel', 'payment_success', 'payment_failure'
  ))
);

CREATE INDEX idx_audit_user_id ON user_audit_log(user_id);
CREATE INDEX idx_audit_action ON user_audit_log(action);
CREATE INDEX idx_audit_created_at ON user_audit_log(created_at);
```

**Log Retention and Archival:**

Log retention policies ensure that audit data is maintained for compliance requirements while managing storage costs and query performance. The retention system includes provisions for automated archival and deletion of old log entries.

Archival processes compress and move old log data to long-term storage while maintaining accessibility for compliance and investigation purposes. The archival system includes provisions for data restoration when historical data access is required.

Query optimization for audit logs includes partitioning strategies that improve performance for common query patterns while maintaining comprehensive coverage. The partitioning strategy is designed to support both real-time monitoring and historical analysis.

### External System Integration Tables

Integration with external systems requires dedicated tables that track synchronization status and provide audit trails for external operations. These tables support both real-time synchronization and batch reconciliation processes.

```sql
CREATE TABLE external_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  system_name VARCHAR(50) NOT NULL,
  operation VARCHAR(50) NOT NULL,
  external_id VARCHAR(100),
  request_data JSONB,
  response_data JSONB,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_system CHECK (system_name IN ('stripe', 'ghl', 'email')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'success', 'failed', 'retrying'))
);

CREATE INDEX idx_sync_user_id ON external_sync_log(user_id);
CREATE INDEX idx_sync_system ON external_sync_log(system_name);
CREATE INDEX idx_sync_status ON external_sync_log(status);
```

**Synchronization Monitoring:**

The synchronization monitoring system provides real-time visibility into the health of external integrations, including success rates, error patterns, and performance metrics. This monitoring is crucial for maintaining system reliability and user experience.

Automated reconciliation processes compare application data with external system data to identify and resolve synchronization discrepancies. These processes run during low-traffic periods to minimize impact on system performance.

Error pattern analysis identifies common integration issues and provides recommendations for resolution. The analysis system includes provisions for automated error categorization and escalation based on error frequency and impact.

