# 🏛️ High-Level Design (HLD) Document
## InfraTrack GIS — Infrastructure Lifecycle & Spatial Asset Governance Platform

---

## 1. System Overview & Objective
**InfraTrack GIS** is a full-stack, cloud-native platform designed to digitize the end-to-end governance of public infrastructure (Roads, Bridges, and Government Buildings). It unifies spatial GIS mapping, a 16-step strict stage-gate lifecycle workflow, dynamic team tracking, multi-department approvals, and 5-year periodic warranty maintenance.

---

## 2. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Client_Tier ["1. Presentation & Client Layer (Next.js / React)"]
        UI1["Multi-Role Web Portal (Tailwind / CSS Tokens)"]
        UI2["Interactive GIS Mapping (Leaflet & OpenStreetMap)"]
        UI3["Real-time Financial & KPI Dashboards (Chart.js / SVG)"]
        UI4["Periodic Maintenance Audit Portal (Photo & Report Uploads)"]
    end

    subgraph App_Tier ["2. Application & Business Logic Tier (Next.js Server Actions)"]
        AP1["Role-Based Access Control (RBAC) & Session Guard"]
        AP2["16-Stage Lifecycle State Machine"]
        AP3["GIS Coordinate & GeoJSON Parser Engine"]
        AP4["Document & Maintenance Audit Trail Manager"]
        AP5["Financial Burn-Rate & Remaining Budget Calculator"]
    end

    subgraph Data_Tier ["3. Database & Storage Tier (MongoDB Atlas & Blob Storage)"]
        DB1[("projects Collection (Assets, Coordinates, Dynamic Team, RCI)")]
        DB2[("bridges Collection (Spans, Pier Types, Conditions)")]
        DB3[("documents Collection (DPR, LOA, MB, QC Certificates)")]
        DB4[("maintenance_records Sub-documents (6M/1Y/2Y/3Y/5Y History)")]
        FS1["File Storage (Site Photos, Defect Images & Inspection Reports)"]
    end

    subgraph Cloud_Tier ["4. Hosting & CI/CD Cloud Infrastructure"]
        INF1["Vercel Global Edge Network (Serverless Node.js Execution)"]
        INF2["MongoDB Atlas (Cloud Managed Multi-Region NoSQL)"]
        INF3["GitHub (Version Control & Automated Deployments)"]
    end

    %% Flow lines
    UI1 -->|Form Actions & State Mutations| AP1
    UI2 -->|Spatial Polylines & Markers| AP3
    UI3 -->|Aggregate Analytics Queries| AP5
    UI4 -->|Periodic Maintenance Logs & Media| AP4

    AP1 --> AP2
    AP2 --> DB1
    AP3 --> DB1
    AP4 --> DB3
    AP4 --> DB4
    AP4 --> FS1
    AP5 --> DB1
    AP5 --> DB2

    INF3 -->|Auto Deploy on Push| INF1
    INF1 --> App_Tier
    App_Tier -->|TLS Connection| INF2
```

---

## 3. End-to-End Data Flow Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Admin as System Admin / Creator
    actor Engineer as Field Engineer
    actor Surveyor as GIS Surveyor
    actor Contractor as Contractor Agency
    actor QC as QC Engineer
    actor Maintenance as Maintenance Team
    participant App as Next.js Server Actions
    participant DB as MongoDB Atlas

    Admin->>App: 1. Create Project (Road / Bridge / Building)
    App->>DB: Save project (Step 1 -> advances to Step 2)
    
    Engineer->>App: 2. Submit Field Inspection & Proposal Report
    App->>DB: Record DPR Brief, unveil Engineering Lead in Team
    
    Surveyor->>App: 3. Plot & Save GIS Coordinates on Map
    App->>DB: Save GeoJSON polyline array, unveil GIS Surveyor
    
    Note over App,DB: Steps 4 - 8: DPR, Clearances, Financial Sanction & Admin Sign-off
    
    Contractor->>App: 10-12. Setup, Daily MB Entries & Completion Report
    App->>DB: Update physical progress (100%), spend cost & site photos
    
    QC->>App: 13. Quality Control Verification & Core Test
    App->>DB: Verify QC specs, record QC certificate
    
    Note over App,DB: Steps 14 - 15: Measurement & Final Asset Registry Enrollment
    
    Maintenance->>App: 16. Submit Periodic Maintenance (6M, 1Y, 2Y, 3Y, 5Y)
    App->>DB: Push audit entry to maintenance_records array (Photos, Report, Updated RCI)
```

---

## 4. Architectural Layer Breakdown

### Layer 1: Client & Presentation Tier
- **Framework**: Next.js 15 App Router with React Server Components (RSC) and interactive client wrappers.
- **GIS Engine**: `leaflet` & `react-leaflet` connected to OpenStreetMap vector tiles for road coordinate tracking and condition color-coding.
- **Dynamic Role Switcher**: Instant role toggle simulating 13 departmental actors (Admin, Engineer, GIS Surveyor, QC, Procurement, Maintenance, etc.).
- **Visual Design**: High-contrast modern UI tokens, responsive layouts, real-time KPI tiles.

### Layer 2: Business Logic & Application Tier
- **Server Actions**: Direct server-side data mutations ensuring zero client-side database credentials exposure.
- **Sequential Stage-Gate Engine**: Validates prerequisite step completion before allowing progression.
- **Dynamic Team Resolver**: Assembles the project's multi-disciplinary committee progressively as milestones are achieved.
- **Maintenance Audit Hub**: Allows repetitive periodic inspection submissions at Step 16 without resetting the project lifecycle.

### Layer 3: Persistence & Database Tier
- **Database**: MongoDB Atlas cloud cluster.
- **Collections Architecture**:
  - `projects`: Primary schema containing asset specifications, geometry, team registry, and maintenance history timeline.
  - `bridges`: Specific sub-asset records with span details, waterbodies, and scour condition ratings.
  - `documents`: Auditable repository of uploaded inspection orders, LOAs, DPRs, and test results.

### Layer 4: Infrastructure & Operations Tier
- **Hosting**: Vercel Serverless Platform with edge caching.
- **Continuous Integration**: GitHub automated repository triggers.
- **Database Connection Pooling**: Cached MongoDB connection client across hot serverless lambdas.

---

## 5. Non-Functional Requirements (NFRs)

| Metric | Target Specification | Implementation Approach |
| :--- | :--- | :--- |
| **Availability** | 99.9% Uptime | Multi-zone MongoDB Atlas replica set + Vercel Global Edge CDN. |
| **Response Latency**| $< 200\text{ ms}$ for dashboard queries | Indexed MongoDB queries + Next.js Server Component streaming. |
| **Security** | RBAC & Safe Uploads | Strict role gatekeeping and sanitized file storage handlers. |
| **Data Durability** | Zero Data Loss | Cloud automated continuous backups in MongoDB Atlas. |
| **Scalability** | Horizontal Serverless Scaling | Stateless Next.js functions scaling instantly with traffic spikes. |
