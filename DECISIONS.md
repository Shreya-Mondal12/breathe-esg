# DECISIONS.md

# Major Design Decisions

---

# 1. CSV Upload Instead of Live ERP/API Integrations

## Decision

The prototype uses CSV uploads for all three source types:

* SAP
* Utility
* Travel

## Why

In real enterprise environments:

* SAP exports are often delivered as scheduled flat files
* utility providers expose inconsistent APIs
* sustainability teams frequently exchange spreadsheets manually

Implementing realistic ingestion workflows was prioritized over building fragile third-party API integrations.

## Alternative Considered

* live SAP OData integration
* Concur API ingestion
* utility provider APIs

## Why Rejected

These integrations would consume most of the project timeline while contributing less to demonstrating ingestion architecture and data modeling judgment.

The assignment emphasized:

* reasoning
* normalization
* auditability
* workflow design

rather than SDK integrations.

---

# 2. Separate Parsers Per Source Type

## Decision

The ingestion layer uses:

* `process_sap_csv()`
* `process_utility_csv()`
* `process_travel_csv()`

instead of a single universal parser.

## Why

Each source type has:

* different schemas
* different validation rules
* different business meaning

A single generic parser would become difficult to maintain and unrealistic for enterprise ESG ingestion.

This separation better reflects real ETL pipelines used in sustainability reporting systems.

---

# 3. Preserve Raw Source Records Before Transformation

## Decision

Raw uploaded rows are stored before normalization.

## Why

This provides:

* audit traceability
* debugging capability
* reconstruction of source submissions
* separation between ingestion and reporting layers

This mirrors how production ESG systems maintain immutable ingestion records.

It also allows analysts and auditors to compare normalized records against original uploaded source data.

---

# 4. Source-of-Truth File Preservation

## Decision

Uploaded source files are stored in the `DataSource` model.

## Why

Enterprise ESG reporting often requires:

* audit evidence
* original upload retention
* provenance tracking

Preserving uploaded files improves:

* explainability
* audit workflows
* regulatory defensibility

---

# 5. Scope Mapping Strategy

## Decision

Scope assignment is inferred from source type.

## Mapping

| Source                   | Scope   |
| ------------------------ | ------- |
| SAP fuel data            | Scope 1 |
| Utility electricity data | Scope 2 |
| Travel data              | Scope 3 |

## Why

This simplified prototype categorization while still demonstrating realistic ESG scope handling.

The goal was to model realistic enterprise categorization workflows without implementing a full emissions accounting engine.

---

# 6. Suspicious Record Detection

## Decision

Prototype validation rules mark:

* missing units
* unusually large quantities
* negative values

as suspicious or failed.

## Why

The assignment emphasized analyst review workflows.

This demonstrates how ingestion pipelines can:

* flag questionable records
* require human validation
* separate trusted vs untrusted data

before final reporting approval.

---

# 7. Analyst-Centric UX

## Decision

The frontend dashboard prioritizes:

* review workflows
* filtering
* approvals
* auditability

instead of customer-facing analytics.

## Why

The assignment specifically described analyst review before auditor signoff.

The UI was therefore optimized around operational review workflows rather than executive dashboards.

---

# 8. PostgreSQL as Primary Database

## Decision

PostgreSQL was selected instead of SQLite.

## Why

PostgreSQL provides:

* stronger JSON support
* production realism
* relational integrity
* better scaling characteristics

This was important because `RawRecord` stores semi-structured JSON payloads from heterogeneous enterprise systems.

---

# 9. Multi-Tenant Architecture

## Decision

All records are associated with a `Company`.

## Why

The assignment explicitly referenced multi-company ESG workflows.

This architecture enables:

* tenant isolation
* future RBAC expansion
* organization-level reporting

without major schema redesign later.

---

# 10. Lightweight Validation Instead of Complex Rules Engine

## Decision

The prototype uses lightweight validation logic instead of a full validation engine.

## Current Rules

* missing units → FAILED
* unusually large quantities → SUSPICIOUS
* negative values → SUSPICIOUS

## Why

The implementation intentionally prioritized:

* workflow clarity
* explainability
* ingestion architecture

over building a complex enterprise validation engine within the limited project timeline.

---

# 11. Duplicate Upload Protection

## Decision

The system prevents re-uploading previously uploaded files using filename-level duplicate detection.

## Why

Enterprise ESG ingestion workflows frequently receive repeated exports from ERP systems, utility providers, or manual analyst submissions.

Duplicate uploads can:

* inflate emissions reporting
* create reconciliation issues
* compromise audit accuracy

Implementing lightweight duplicate protection demonstrates ingestion governance and operational safety controls.

## Tradeoff

The prototype uses filename matching rather than checksum or hash-based validation.

This was intentionally chosen to keep the MVP implementation simple while still demonstrating realistic ingestion integrity controls.

---

# 12. Finalized Review Locking

## Decision

Records marked as:

* APPROVED
* REJECTED

cannot be modified again.

## Why

This simulates governance controls commonly used in compliance and audit systems.

Once an analyst finalizes a review decision, additional edits could compromise:

* audit traceability
* workflow integrity
* regulatory defensibility

The backend enforces this rule even if frontend controls are bypassed.

---

# 13. Upload History Tracking

## Decision

The dashboard includes upload history visibility through the `DataSource` model.

## Why

Operational ESG systems require visibility into:

* uploaded files
* ingestion timing
* provenance
* source tracking

This feature improves operational transparency and helps analysts validate ingestion workflows.

---

# 14. Workspace Reset Workflow

## Decision

A reset endpoint was implemented to clear uploaded records, audit logs, and ingestion history.

## Why

During analyst testing and ingestion reprocessing, teams often need to:

* clear staging environments
* rerun ingestion pipelines
* re-upload corrected source files

This feature simulates operational reset tooling commonly used in enterprise staging workflows.

The reset process deletes records in dependency order to preserve relational integrity.

---

# 15. Human-in-the-Loop Review Workflow

## Decision

The ingestion system intentionally requires analyst review before records are considered finalized.

## Why

Enterprise ESG reporting workflows cannot fully trust raw uploaded operational data.

The platform therefore models:

* ingestion
* validation
* anomaly detection
* analyst review
* audit logging

before finalized reporting approval.

This reflects real sustainability governance workflows used in regulated reporting environments.

---

# Questions I Would Ask the PM

1. Should uploaded source files become immutable after analyst approval?

2. Are auditors expected to download original uploaded files?

3. Should emissions factors be calculated within the platform or externally?

4. Is deduplication required across repeated uploads?

5. Are utility billing periods expected to align with reporting months?

6. Should analysts be allowed to edit normalized records directly?

7. Is row-level versioning required for all analyst edits?

8. Should suspicious thresholds vary by source type or company?

9. Should finalized records require secondary reviewer approval?

10. Should upload resets be restricted to administrators only?
