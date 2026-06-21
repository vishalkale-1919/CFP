# 🍃 EcoTrack Core Calculation Engine Deployment Blueprint

Production runtimes are fully decoupled into an asynchronous, multi-region architecture:
* **Frontend SPA App:** Hosted on Vercel Edge Networks.
* **Calculation Microservice:** Containerized on Render (Docker Node instance type).
* **Storage Cluster:** Managed via PlanetScale / Amazon RDS instances (MySQL 8.0 Engine).

---

## 🔑 Environment Configuration Matrix

### 1. Backend Web Service Variables (Render Dashboard Dashboard)
Set these variables securely inside your Render instance environment console configuration panel:

| Key | Example Value | Intent / Scope |
|-----|---------------|----------------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<host>:3306/carbon_db?useSSL=true` | Primary cloud database location URI |
| `SPRING_DATASOURCE_USERNAME` | `db_admin_root` | Master connection user ID account |
| `SPRING_DATASOURCE_PASSWORD` | `••••••••••••••••` | Database secret connection passphrase |
| `JWT_SECRET_KEY` | `4a7f...2d9e` | HS256 authentication string token |
| `AI_ENGINE_URL` | `https://ai-module.onrender.com` | Internal loop route linking Python |

### 2. Frontend SPA Variables (Vercel Console)
Add this deployment flag variables statement value parameter to your project pipeline dashboard setup:

| Key | Example Value | Intent / Scope |
|-----|---------------|----------------|
| `VITE_API_BASE_URL` | `https://backend-service.onrender.com/api/v1` | Root HTTP link tracking Spring APIs |

---

## 🚀 Step-by-Step Production Deployment Guide

### Phase A: Storage Setup
1. Instantiate an external clean cloud database schema node mapping on your preferred cluster.
2. Run the database seed table updates inside your active cluster terminal using `database/gamification.sql`.

### Phase B: Spring Boot API Deployment on Render
1. Create a new **Web Service** instance inside your Render management dashboard console.
2. Connect your core Git production repository source to the application card interface.
3. Select **Docker** as your primary environmental configuration pipeline layer option.
4. Expand the **Advanced Options** container dropdown link and paste the required Backend Service table environment variables listed above.
5. Click **Deploy Web Service**.

### Phase C: React SPA Deployment on Vercel
1. Select **New Project** inside your Vercel organization project dashboard interface.
2. Import your linked system application Git repository path location source.
3. Select **Vite** or **Create React App** as your core target asset framework compile setting.
4. Override the custom project directory property value link to point explicitly to your root `/frontend` folder.
5. Expand the **Environment Variables** options section block and input the required target backend runtime parameters.
6. Click **Deploy**.

---

## 📊 Live Monitoring, Telemetry, & Alerting Profiles

To maintain absolute performance parity across your live production microservice, ensure the following core metric boundaries are actively integrated into your Render dashboard or external APM tooling integrations (such as Datadog or Prometheus/Grafana stacks):

### 🚨 Critical Application Level Thresholds
* **Calculation Latency SLA:** Fire a high-priority PagerDuty / Slack warning notification event if your endpoint API handling durations cross over **500ms** across consecutive payload tracks.
* **HTTP Error Spikes:** Monitor for any abrupt increases where response codes falling within the `5xx Server Error` cluster account for greater than **2%** of total transaction throughput metrics over 5-minute sampling windows.

### 💻 Infrastructure Computing Limits
* **CPU Throttle Alerting Bounds:** Automatically trigger vertical scaling routines or system warning notices if container processing utilization scales and sustains above a **75%** workload threshold benchmark for longer than 10 continuous runtime minutes.
* **Memory Out-of-Memory (OOM) Safety Guard:** Set strict alert tracking flags if memory heap profiles consume greater than **85%** of available container memory resources to isolate potential memory leaks before the service restarts.