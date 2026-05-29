# SOURCES.md

# Source Research and Ingestion Assumptions

This document summarizes the research and assumptions used while designing the ingestion architecture and sample datasets for the ESG emissions platform.

The assignment intentionally did not provide predefined schemas, so realistic enterprise ingestion patterns were researched and simulated.

---

# 1. SAP Fuel / Procurement Data

## What Was Researched

Typical SAP ERP sustainability-related exports commonly use:

* flat file exports
* CSV reports
* procurement extracts
* operational fuel usage reports
* IDoc/OData integrations

In many enterprise environments, sustainability teams still receive scheduled CSV exports from SAP systems rather than integrating directly with ERP APIs.

---

## Chosen Ingestion Mode

CSV upload.

---

## Why CSV Was Chosen

CSV uploads are:

* realistic for sustainability operations
* easy for analysts to validate manually
* compatible with scheduled enterprise exports
* easier to audit than opaque API transformations

The assignment emphasized ingestion architecture and workflow reasoning over SDK integration complexity.

---

## Sample Dataset Characteristics

The SAP sample dataset includes:

* plant codes
* multiple fuel types
* inconsistent industrial units
* suspiciously large quantities
* missing values

These patterns reflect realistic ERP export inconsistencies.

---

## Example Fields

* Plant Code
* Fuel Type
* Quantity
* Unit
* Posting Date

---

# 2. Utility Electricity Data

## What Was Researched

Utility and facilities reporting workflows commonly involve:

* electricity billing spreadsheets
* meter-level exports
* utility portal downloads
* monthly consumption reports

Many utility providers expose inconsistent APIs depending on region and vendor.

As a result, sustainability teams frequently rely on exported spreadsheets or CSVs.

---

## Chosen Ingestion Mode

CSV upload.

---

## Why CSV Was Chosen

CSV uploads realistically model:

* monthly billing workflows
* facilities reporting processes
* manual sustainability data collection

This approach also keeps the ingestion workflow explainable and auditable.

---

## Sample Dataset Characteristics

The utility sample includes:

* meter IDs
* billing periods
* tariff classifications
* missing usage values
* large consumption values

These reflect realistic operational utility datasets.

---

## Example Fields

* Meter ID
* Billing Period
* kWh
* Tariff

---

# 3. Corporate Travel Data

## What Was Researched

Corporate travel platforms such as:

* Concur
* Navan
* TravelPerk

typically expose:

* reporting exports
* expense summaries
* travel categories
* booking metadata
* trip distance data

Most sustainability reporting teams aggregate exported travel reports instead of building direct booking-system integrations.

---

## Chosen Ingestion Mode

CSV upload simulating exported travel reports.

---

## Why CSV Was Chosen

Direct API integration was intentionally deferred in favor of:

* ingestion architecture
* normalization logic
* analyst review workflows

The assignment prioritized realistic ingestion thinking over third-party SDK integration.

---

## Sample Dataset Characteristics

The travel sample includes:

* flights
* trains
* hotels
* long-distance travel
* missing values
* mixed travel categories

This reflects realistic business travel reporting exports.

---

## Example Fields

* Traveler
* Travel Mode
* Distance

---

# Scope Mapping Assumptions

The prototype uses simplified ESG scope categorization based on source type.

| Source              | ESG Scope |
| ------------------- | --------- |
| SAP fuel data       | Scope 1   |
| Utility electricity | Scope 2   |
| Travel data         | Scope 3   |

This mapping was intentionally simplified to demonstrate realistic ESG categorization workflows without implementing a full emissions accounting engine.

---

# Validation Assumptions

The ingestion pipeline currently flags:

* missing units
* unusually large quantities
* negative quantities

as suspicious or failed.

This models lightweight analyst-review workflows commonly used in sustainability operations.

---

# Duplicate Upload Assumptions

The system currently prevents duplicate uploads using original file names stored in the `DataSource` model.

This was intentionally implemented as a lightweight governance mechanism to simulate ingestion integrity controls commonly used in enterprise reporting systems.

The prototype intentionally does not implement:

* hash-based deduplication
* checksum validation
* semantic duplicate detection

These were considered out of scope for the project timeline.

---

# Review Workflow Assumptions

The platform assumes:

* uploaded records are not automatically trusted
* analysts review suspicious records before finalization
* approved/rejected records become immutable
* all review changes are audit logged

This models realistic sustainability governance workflows used before auditor signoff.

---

# Upload History Assumptions

The dashboard preserves ingestion provenance through upload history tracking.

This assumes analysts may need visibility into:

* ingestion timing
* uploaded source files
* source types
* operational ingestion activity

This reflects operational traceability requirements common in ESG reporting systems.

---

# Workspace Reset Assumptions

The prototype includes a workspace reset capability for:

* ingestion testing
* corrected file reprocessing
* analyst staging workflows

The reset process intentionally clears:

* upload history
* normalized records
* raw ingestion records
* audit logs

This simulates operational staging reset workflows commonly used during ingestion QA and reconciliation.

---

# Real-World Constraints Acknowledged

The prototype intentionally does not implement:

* live ERP integrations
* utility PDF OCR
* automatic emissions factor calculations
* advanced ML anomaly detection
* checksum-based deduplication
* distributed ingestion queues
* real-time streaming ingestion
* RBAC authentication systems

These were intentionally scoped out to prioritize:

* ingestion architecture
* auditability
* source preservation
* governance workflows
* analyst review lifecycle
* operational traceability

within the project timeline.

---

# Workflow Lifecycle Summary

The current ingestion lifecycle is:

1. CSV uploaded
2. Source file preserved
3. RawRecord created
4. EmissionRecord normalized
5. Validation rules applied
6. Suspicious records flagged
7. Analyst review performed
8. Audit logs generated
9. Finalized records locked
10. Upload history preserved

This reflects simplified enterprise ESG governance workflows.
