---
description: "CDviz platform documentation: collector, database, and Grafana dashboards. Open-source SDLC observability built on CDEvents."
---

# CDviz Platform Overview

CDviz is an open-source SDLC observability platform that collects, stores, and visualizes software delivery events using the [CDEvents](./cdevents.md) standard. It answers operational questions like "What version is running in production?", "When did we last deploy service X?", and "What is our deployment frequency?", without manual correlation of data across CI/CD tools.

CDviz comprises three components: a **Collector** that ingests events from GitHub, GitLab, ArgoCD, Kubernetes, custom webhooks, and HTTP polling (for systems without push support); a **Database** built on PostgreSQL/TimescaleDB for event storage (ClickHouse is also available as a collector sink, though the Grafana dashboards currently require PostgreSQL); and **Grafana dashboards** for deployment tracking, DORA metrics, incidents, and artifact timelines.

CDviz favors a push (event-driven) model. It has lower overhead, and the same event stream can trigger downstream automation via NATS, Kafka, or HTTP. CDviz also pulls data via polling for systems that cannot push (unlike polling-only tools such as Apache DevLake).

## Key Capabilities

CDviz enables organizations to answer critical operational questions:

- Current application version deployment status across environments
- Version correlation between deployed applications and observable runtime metrics
- End-to-end deployment process duration metrics
- CI/CD pipeline performance analytics
- [DORA metrics](./cdviz-grafana/dora_metrics.md) implementation and visualization

## Getting Started

> [!TIP] Try it instantly
> Explore a live read-only instance of the CDviz Grafana dashboards at
> **[demo.cdviz.dev/grafana](https://demo.cdviz.dev/grafana/)**. No installation required.

New to CDviz? Start with the **[Getting Started Guide](./getting-started.md)**. It runs a local CDviz environment, sends your first events, and shows the results in Grafana.

## CDEvents

CDviz is built on the **[CDEvents](https://cdevents.dev/)** specification. See **[how CDviz uses CDEvents](./cdevents.md)**.

## Architecture

The **[Architecture](./architecture.md)** page shows how the CDviz components work together.

## From Events to Insight in 4 Steps

CDviz follows the same four steps end to end:

1. **Event Collection**: the **[CDviz Collector](./cdviz-collector/index.md)** ingests events from GitHub, GitLab, Jenkins, ArgoCD, Kubernetes, and more, and normalizes them into CDEvents. Start from the **[Integrations catalog](./integrations/index.md)**.
2. **Event Store**: the **[CDviz Database](./cdviz-db/index.md)** (PostgreSQL + TimescaleDB) persists every event for time-series analytics.
3. **Event Monitoring**: **[dashboards](./event-monitoring.md)** surface DORA metrics, deployment timelines, and incidents in Grafana, CDviz Cloud, or your own analytics stack.
4. **Event Reaction**: the same event stream **[triggers automation](./event-reaction.md)** via webhooks (Argo Workflows, n8n, Zapier, ...), Kafka, NATS, or SSE.

## Other Resources

- **[Alternatives](./alternatives/index.md):** A list of alternative tools to CDviz.
