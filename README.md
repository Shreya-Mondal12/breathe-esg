# Breathe ESG - Multi-Source Emissions Ingestion & Review Platform

## Overview

This project was built as part of the Breathe ESG Tech Intern Assignment.

The goal was to prototype a system capable of ingesting emissions-related activity data from multiple enterprise sources, normalizing it into a consistent format, and enabling analyst review before audit sign-off.

The application consists of:

* Django REST Backend
* React Frontend
* Multi-source ingestion pipeline
* Analyst review workflow
* Audit logging system
* Unit normalization engine
* Source-of-truth tracking

---

## Problem Statement

Enterprise sustainability data rarely comes from a single source.

Organizations typically maintain:

* Fuel and procurement data in SAP
* Electricity consumption data from utility providers
* Corporate travel data from platforms such as Concur or Navan

Each source has different structures, naming conventions, units, and data quality issues.

The objective of this prototype is to:

1. Ingest data from multiple source types
2. Normalize the records
3. Flag suspicious or invalid records
4. Enable analyst review
5. Maintain auditability and source tracking

---

## Features

### Multi-Source Data Ingestion

Supported sources:

#### SAP Fuel / Procurement Data

* CSV upload
* Scope 1 classification
* Fuel activity tracking
* Unit normalization

#### Utility Electricity Data

* CSV upload
* Scope 2 classification
* Meter consumption tracking
* Billing-period data support

#### Corporate Travel Data

* CSV upload
* Scope 3 classification
* Flight, train, hotel and ground transport activities

---

### Data Normalization

The platform standardizes:

* Units
* Activity categories
* ESG scope classification
* Source metadata

Examples:

| Raw Unit | Normalized  |
| -------- | ----------- |
| L        | liters      |
| GAL      | gallons     |
| m3       | cubic_meter |
| kWh      | kWh         |
| KM       | kilometer   |

---

### Validation Workflow

Records can be marked as:

* Pending
* Suspicious
* Approved
* Rejected
* Failed

Examples of validation checks:

* Missing units
* Extremely large values
* Invalid quantities

---

### Analyst Review Dashboard

Analysts can:

* Review ingested records
* Search records
* Filter by status
* Approve records
* Reject records
* Monitor suspicious submissions

---

### Audit Logging

Every review action creates an audit trail.

Tracked information:

* Record ID
* Previous state
* New state
* Reviewer
* Timestamp

This supports audit readiness and traceability.

---

### Upload History

The platform tracks:

* Uploaded files
* Upload timestamps
* Source type
* Source ownership

---

### Workspace Reset

A workspace reset feature allows:

* Clearing uploaded records
* Removing audit history
* Restarting demonstrations

Useful during testing and onboarding workflows.

---

## System Architecture

Frontend

React + Axios

Responsibilities:

* File uploads
* Dashboard rendering
* Analyst review workflow
* Search and filtering
* KPI visualization

Backend

Django REST Framework

Responsibilities:

* CSV ingestion
* Data validation
* Normalization
* Audit logging
* Record management

Database

SQLite (prototype)

Core Models:

* Company
* DataSource
* RawRecord
* EmissionRecord
* AuditLog

---

## Data Model Summary

### Company

Represents a tenant organization.

### DataSource

Tracks uploaded source files.

Stores:

* Source type
* Upload timestamp
* Original file

### RawRecord

Preserves the original source payload.

Acts as the source-of-truth layer.

### EmissionRecord

Normalized ESG activity record.

Contains:

* Scope classification
* Activity type
* Quantity
* Units
* Review status

### AuditLog

Tracks analyst review actions.

---

## Example Source Types

### SAP Fuel Data

Columns:

* Plant Code
* Fuel Type
* Quantity
* Unit
* Posting Date

### Utility Data

Columns:

* Meter ID
* Billing Period
* kWh
* Tariff

### Travel Data

Columns:

* Traveler
* Travel Mode
* Distance

---

## Running Locally

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

Backend runs at:

```text
http://breathe-esg-5m0j.onrender.com
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Design Decisions

Key design decisions and rationale are documented in:

* MODEL.md
* DECISIONS.md
* TRADEOFFS.md
* SOURCES.md

---

## Known Limitations

This prototype intentionally does not include:

* Live SAP integrations
* Concur/Navan API integrations
* OCR for utility bills
* Automated CO₂e calculations
* Role-based access control
* Real-time collaboration
* Advanced anomaly detection

These tradeoffs are discussed in TRADEOFFS.md.

---

## Future Improvements

Potential extensions:

* Emissions factor engine
* Authentication and RBAC
* PDF utility bill ingestion
* ERP API integrations
* Historical anomaly detection
* Analyst comments and review notes
* PostgreSQL deployment
* Background processing with Celery

---

## Submission Contents

Repository includes:

* Django backend
* React frontend
* Sample datasets
* MODEL.md
* DECISIONS.md
* TRADEOFFS.md
* SOURCES.md

---
