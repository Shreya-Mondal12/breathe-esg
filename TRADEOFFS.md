# TRADEOFFS.md

# Deliberately Deferred Features

This document explains the architectural and implementation tradeoffs made during the prototype development process.

The project was intentionally scoped to prioritize:

* ingestion architecture
* normalization
* auditability
* analyst workflows
* governance visibility

within the limited implementation timeline.

---

# 1. Real Third-Party API Integrations

## Not Implemented

* SAP OData APIs
* Concur APIs
* Navan APIs
* Utility provider APIs

## Why

The assignment emphasized:

* ingestion thinking
* normalization logic
* workflow design
* auditability

rather than SDK integrations.

Implementing production-grade ERP integrations would require:

* authentication flows
* token rotation
* API rate limiting
* provider-specific schemas
* long integration timelines

Instead, CSV ingestion was chosen because it:

* realistically simulates enterprise export workflows
* keeps the ingestion layer explainable
* allows focus on normalization architecture

---

# 2. PDF Utility Bill Parsing

## Not Implemented

OCR or PDF extraction pipelines.

## Why

PDF ingestion would require:

* OCR infrastructure
* layout extraction
* provider-specific parsing templates
* document classification logic

This was intentionally scoped out to prioritize:

* ingestion workflows
* review systems
* auditability

rather than document AI engineering.

---

# 3. Automatic CO2e Emissions Calculations

## Not Implemented

Automatic emissions factor calculations using:

* EPA databases
* DEFRA factors
* region-based conversion tables

## Why

The assignment primarily focused on:

* ingestion
* normalization
* analyst review
* audit workflows

rather than full emissions accounting methodology.

The prototype therefore models emissions ingestion architecture rather than sustainability accounting logic.

---

# 4. Advanced Validation Engine

## Partially Implemented

The prototype currently supports lightweight validation rules:

* missing units
* negative quantities
* unusually large quantities
* duplicate upload prevention

## Not Implemented

* schema inference
* historical anomaly detection
* statistical validation
* ML anomaly scoring
* semantic duplicate detection
* checksum-based deduplication

## Why

The prototype intentionally prioritizes:

* explainability
* lightweight governance
* human-in-the-loop review
* operational transparency

rather than complex validation infrastructure.

The goal was to demonstrate:

* suspicious flagging
* analyst approval workflows
* ingestion governance thinking

without overengineering validation systems.

---

# 5. Authentication and RBAC

## Not Implemented

* JWT authentication
* role-based access control
* analyst/admin permissions
* SSO integration

## Why

The assignment focused more heavily on:

* ingestion architecture
* source tracking
* auditability
* workflow modeling

Authentication was intentionally deprioritized to maximize time spent on ESG-specific workflow functionality.

---

# 6. Async Batch Processing

## Not Implemented

* Celery workers
* Redis queues
* distributed ingestion pipelines
* async processing orchestration

## Why

The prototype processes uploads synchronously for simplicity and explainability.

The current implementation is sufficient for:

* analyst uploads
* small-to-medium datasets
* workflow demonstrations

without introducing distributed systems complexity.

---

# 7. Schema Auto-Detection

## Not Implemented

Automatic schema inference for arbitrary CSV uploads.

## Why

The assignment explicitly emphasized:

* realistic source handling
* enterprise judgment
* ingestion reasoning

Instead of attempting unconstrained “upload anything” behavior, the system intentionally supports:

* SAP exports
* Utility exports
* Travel exports

with dedicated source-specific parsers.

This approach is:

* more maintainable
* more realistic
* easier to audit
* operationally safer

for enterprise ESG workflows.

---

# 8. Direct Record Editing

## Not Implemented

Inline editing of normalized records.

## Why

Allowing unrestricted edits would:

* complicate auditability
* weaken source-of-truth guarantees
* require versioning logic
* reduce workflow integrity

The prototype instead emphasizes:

* review workflows
* approval/rejection states
* immutable finalized records
* audit logging
* ingestion preservation

which aligns better with governance-oriented ESG systems.

---

# 9. Real-Time Collaboration

## Not Implemented

* live analyst collaboration
* websocket updates
* concurrent editing resolution

## Why

The assignment scope focused on ingestion and audit workflows rather than collaborative productivity tooling.

---

# 10. Large-Scale Scalability Engineering

## Not Implemented

* sharded databases
* distributed queues
* object storage optimization
* streaming ingestion
* horizontally scaled processing

## Why

The prototype is optimized for:

* clarity
* architectural explainability
* realistic workflows
* operational governance visibility

rather than hyperscale infrastructure engineering.

---

# 11. Checksum-Based Duplicate Detection

## Not Implemented

The system currently prevents duplicates using original uploaded file names.

## Why

Hashing and checksum validation would require:

* file fingerprinting
* binary comparison workflows
* storage optimization
* ingestion hashing pipelines

Filename-level detection was intentionally chosen because it:

* keeps the MVP lightweight
* demonstrates governance thinking
* solves the majority of analyst testing scenarios
* remains easy to explain operationally

---

# 12. Granular Role Permissions

## Not Implemented

The system currently assumes a generic analyst role.

It does not yet differentiate between:

* analysts
* auditors
* administrators
* compliance reviewers

## Why

The assignment focused more heavily on ingestion lifecycle modeling than enterprise IAM architecture.

This was intentionally deferred to prioritize:

* review workflows
* auditability
* source preservation
* operational governance

within the project timeline.

---

# 13. Soft Deletes and Recovery Workflows

## Not Implemented

The reset workflow permanently deletes records rather than archiving them.

## Why

Production ESG systems would likely implement:

* soft deletes
* archival tables
* recovery workflows
* retention policies

The prototype instead prioritizes:

* implementation simplicity
* staging reset workflows
* ingestion reprocessing demonstrations

for analyst testing scenarios.

---

# 14. Automated Reviewer Assignment

## Not Implemented

The platform does not automatically assign suspicious records to analysts.

## Why

Workflow orchestration systems would require:

* queues
* reviewer assignment logic
* workload balancing
* notification infrastructure

The assignment instead focused on demonstrating:

* ingestion architecture
* analyst review lifecycle
* governance traceability
* audit workflows

within a constrained implementation window.

---

# Final Architectural Philosophy

The prototype intentionally prioritizes:

* explainability
* governance visibility
* auditability
* ingestion realism
* analyst workflows
* operational traceability

over:

* infrastructure scale
* automation complexity
* AI-driven validation
* enterprise IAM systems

This tradeoff was intentionally chosen to maximize signal within the assignment timeline while still modeling realistic ESG operational workflows.
