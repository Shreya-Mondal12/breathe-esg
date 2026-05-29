# MODEL.md

## System Overview

The platform is designed as a multi-source ESG emissions ingestion and analyst review system. The primary objective is to ingest heterogeneous enterprise sustainability datasets, normalize them into a unified structure, preserve source-of-truth records for auditability, and provide analyst workflows for review and approval before audit lock.

The architecture intentionally separates:

1. Raw source ingestion
2. Normalization and transformation
3. Analyst-reviewed emissions records
4. Audit tracking
5. Upload provenance tracking

This separation mirrors how enterprise ESG systems preserve traceability between original client submissions and finalized emissions calculations.

---

# Core Data Model

## 1. Company

Represents a tenant/customer organization.

### Purpose

* Enables multi-tenancy
* Separates emissions data by client
* Supports enterprise onboarding workflows

### Key Fields

* `name`
* `created_at`

### Why It Exists

The assignment explicitly required multi-tenancy support. All emissions, ingestion, and audit records are associated with a company.

---

## 2. DataSource

Represents an uploaded source dataset.

### Purpose

* Tracks where records originated from
* Preserves uploaded source files
* Supports audit traceability
* Distinguishes ingestion source types
* Enables upload history tracking

### Supported Source Types

* SAP
* UTILITY
* TRAVEL

### Key Fields

* `company`
* `source_type`
* `uploaded_file`
* `original_file_name`
* `uploaded_at`
* `uploaded_by`

### Why It Exists

Enterprise ESG reporting requires maintaining source provenance. Auditors frequently require access to original uploaded files and ingestion timestamps.

This model acts as the source-of-truth anchor for all downstream normalized records.

The same model also powers the frontend upload history dashboard.

### Additional Behavior

The platform currently prevents duplicate uploads by checking previously uploaded file names stored in this model.

---

## 3. RawRecord

Stores untouched source rows exactly as received.

### Purpose

* Preserve original incoming data
* Enable audit reconstruction
* Support debugging and ingestion validation
* Decouple raw source formats from normalized models

### Key Fields

* `datasource`
* `raw_data (JSON)`
* `created_at`

### Why It Exists

Client datasets are often messy, incomplete, or inconsistently structured. Instead of transforming directly into emissions records, the system first stores raw source data.

This mirrors real enterprise ingestion pipelines where raw ingestion layers are preserved independently from transformed reporting layers.

---

## 4. EmissionRecord

Represents normalized emissions/activity records.

### Purpose

* Unified reporting structure
* Scope categorization
* Analyst review workflow
* Normalized units and activity tracking
* Governance review lifecycle

### Key Fields

* `company`
* `raw_record`
* `scope`
* `category`
* `activity_type`
* `quantity`
* `unit`
* `normalized_unit`
* `review_status`

### Scope Mapping

| Source                   | Scope   |
| ------------------------ | ------- |
| SAP fuel data            | Scope 1 |
| Utility electricity data | Scope 2 |
| Corporate travel         | Scope 3 |

### Why It Exists

Different client systems expose data differently. EmissionRecord acts as a canonical normalized structure independent of source-specific schemas.

This simplifies analyst review workflows and downstream reporting.

### Review Lifecycle

Records may exist in:

* PENDING
* APPROVED
* REJECTED
* SUSPICIOUS
* FAILED

### Governance Controls

Once a record is marked:

* APPROVED
* REJECTED

the system prevents additional review modifications to preserve workflow integrity and audit defensibility.

---

## 5. AuditLog

Tracks changes made during analyst review.

### Purpose

* Preserve audit history
* Record review actions
* Track status transitions
* Support compliance workflows

### Key Fields

* `record`
* `action`
* `changed_by`
* `old_value`
* `new_value`
* `timestamp`

### Why It Exists

ESG reporting requires explainability and traceability. Audit logs provide visibility into who changed records and when.

The system currently logs:

* approvals
* rejections
* review status updates

This provides an immutable review trail for analyst actions.

---

# Ingestion Architecture

## Source-Specific Parsing

The ingestion layer intentionally separates parsing logic by source type.

### SAP Parser

Handles:

* fuel quantities
* procurement-style exports
* inconsistent industrial units
* plant-level activity data

### Utility Parser

Handles:

* electricity usage
* meter-based records
* billing periods
* tariff metadata

### Travel Parser

Handles:

* flights
* trains
* hotels
* ground transport

This separation reflects realistic enterprise ESG ingestion where schemas differ significantly between operational systems.

---

# Normalization Strategy

## Unit Normalization

The system maps inconsistent units into canonical representations.

Examples:

* `L → liters`
* `LTR → liters`
* `GAL → gallons`
* `kWh → kilowatt_hour`
* `KM → kilometer`

Normalization occurs before records are surfaced to analysts.

---

# Validation & Review Workflow

## Validation Rules

The ingestion layer currently validates:

* missing units
* negative quantities
* unusually large quantities

### Validation Outcomes

| Condition                | Result     |
| ------------------------ | ---------- |
| Missing unit             | FAILED     |
| Negative quantity        | SUSPICIOUS |
| Extremely large quantity | SUSPICIOUS |

These validations intentionally simulate lightweight enterprise ingestion governance.

---

# Human-in-the-Loop Workflow

The platform intentionally models analyst-driven ESG review workflows.

### Workflow Lifecycle

1. CSV uploaded
2. RawRecord created
3. EmissionRecord normalized
4. Validation rules applied
5. Suspicious records flagged
6. Analyst approves/rejects records
7. AuditLog generated
8. Finalized records locked

This mirrors real sustainability governance workflows used in enterprise reporting systems.

---

# Frontend Architecture

## Analyst Dashboard

The React dashboard supports:

* CSV uploads
* source-type selection
* upload history
* search
* filtering
* record review
* approval/rejection workflows
* audit logging
* analytics cards
* workspace reset functionality

The dashboard is intentionally optimized for analyst usability rather than end-customer self-service.

---

# Workspace Reset Workflow

## Purpose

The system includes a reset endpoint for clearing:

* upload history
* normalized records
* raw ingestion data
* audit logs

### Why It Exists

This supports:

* ingestion reprocessing
* testing workflows
* corrected source re-uploads
* staging resets

The reset operation deletes records in dependency order to maintain relational integrity.

---

# Architectural Tradeoffs

The prototype prioritizes:

* traceability
* source preservation
* normalized reporting
* analyst workflows
* auditability
* governance visibility

over:

* automated emissions factor calculations
* real-time API integrations
* advanced ML anomaly detection
* distributed processing pipelines

This was intentionally scoped for a 4-day implementation window.
