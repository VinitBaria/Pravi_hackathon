# 🔄 Step-by-Step Infrastructure Lifecycle Guide
## Complete 16-Stage Governance & Maintenance Workflow

This document provides a detailed breakdown of each stage in the 16-step infrastructure lifecycle implemented in **InfraTrack GIS**.

---

## Workflow Matrix

| Step | Stage Name | Assigned Role | Required Inputs / Documents | Output & Next Trigger |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Report Issue / Request** | System Administrator (`admin`) | Asset Category (Road / Bridge / Building), Budget, Location | Project initialized; moves to Step 2 |
| **2** | **Engineering Field Report & Proposal** | Engineering Officer (`engineer`) | Field inspection report, engineering estimate, design specs | Engineering lead assigned; moves to Step 3 |
| **3** | **GIS Mapping & Spatial Analysis** | Surveyor / GIS Team (`surveyor`) | Interactive route polyline coordinate plotting | Route geometry saved; moves to Step 4 |
| **4** | **DPR Consultant Detailed Reports** | DPR / Design Consultant (`dpr`) | Soil assessment, traffic capacity analysis, DPR document | DPR cleared; moves to Step 5 |
| **5** | **Planning & Utility Clearances** | Planning & Clearances (`planning`) | Land acquisition clearance, forest/utility NOCs | Clearances granted; moves to Step 6 |
| **6** | **Asset Manager Pre-Approval** | Asset Manager (`asset_mgr`) | Asset registry impact check, asset code tag | Pre-approval verified; moves to Step 7 |
| **7** | **Financial Sanction** | Budget / Finance Officer (`finance`) | Budget allocation letter, treasury head verification | Financial sanction released; moves to Step 8 |
| **8** | **Administrative Prioritisation & Approval** | Approving Authority (`admin_approver`) | High-priority signoff, administrative order | Approved for procurement; moves to Step 9 |
| **9** | **Tender & Contract Award** | Procurement Officer (`procurement`) | Tender floating, bidder evaluation, Letter of Acceptance (LOA) | LOA issued to contractor; moves to Step 10 |
| **10** | **Execution Setup** | Contractor (`contractor`) | Site mobilization plan, equipment setup photos | Status changes to *Construction*; moves to Step 11 |
| **11** | **Construction Monitoring** | Contractor (`contractor`) | Measurement Book (MB) entries, daily physical progress % | Progress % and spend updated; moves to Step 12 |
| **12** | **Contractor Work Completion** | Contractor (`contractor`) | Completion certificate, completed site photographs | Physical progress set to 100%; moves to Step 13 |
| **13** | **Quality Control Verification** | QC Engineer / Lab (`qc`) | Core compression test, bitumen density, QC clearance cert | QC clearance affirmed; moves to Step 14 |
| **14** | **Measurement & Billing** | Accounts / Finance (`accounts`, `finance`) | Final invoice verification, contractor payment release | Financial settlement closed; moves to Step 15 |
| **15** | **Asset Registry Update** | GIS Team / Asset Manager (`asset_mgr`, `surveyor`) | Final geo-tagging, official state asset ledger incorporation | Status becomes *Active / Under Maintenance*; moves to Step 16 |
| **16** | **Post-Construction Periodic Maintenance** | Maintenance Agency (`maintenance`) | **6M / 1Y / 2Y / 3Y / 5Y** periodic inspection audit, defect photos, updated RCI | Appends to maintenance history timeline; stays active for future audits |

---

## 🛠️ Step 16: Maintenance Periodic Cycle

Unlike earlier sequential steps that advance once, **Step 16 is a recurring operational state**:
1. **Periodic Interval Selection**: The maintenance inspector selects the audit timeframe:
   - `6 Months`
   - `1 Year`
   - `2 Years`
   - `3 Years`
   - `5 Years`
2. **Mandatory Documentation**:
   - Upload official Maintenance / Defect Inspection Report PDF.
   - Upload high-resolution site defect photographs.
   - Enter updated **Road Condition Index (RCI)** (for roads) or **Condition Score** (for buildings/bridges).
   - Detailed observations and structural maintenance notes.
3. **Historical Audit Timeline**: All submissions are appended chronologically to the project's permanent maintenance timeline, accessible by all departments and auditors.
