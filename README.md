# cdviz-site

Source code of the [CDviz website and documentation](https://cdviz.dev): VitePress + Bun + TailwindCSS.

The product (database schema, dashboards, Helm charts, demos) lives in [cdviz-dev/cdviz](https://github.com/cdviz-dev/cdviz).

## Development

```bash
mise install
mise run install   # bun install
mise run dev       # http://localhost:5173
mise run build     # production build + url checks
```

See [AGENTS.md](AGENTS.md) for structure and conventions.
