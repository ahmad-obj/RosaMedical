# Rosa Medical WordPress local / Gate 0 runbook

## Safety boundary

This environment is disposable and local. It must not connect to Hostinger, the live Rosa database, Cloudflare production runtime, or unrelated domains/sites.

## Prerequisites

- Docker with Compose v2
- purchased MedicaShop Template Kit ZIP stored outside the repository
- Elementor Pro ZIP only if a later controlled Pro comparison is explicitly chosen

## Free-first pass

```bash
cp wordpress/dev/.env.example wordpress/dev/.env
export ROSA_GATE0_MODE=free
export ROSA_MEDICASHOP_KIT_ZIP=/absolute/path/to/medicashop.zip
bash wordpress/scripts/gate0-preflight.sh
bash wordpress/scripts/gate0-bootstrap.sh
```

Open `http://localhost:8088`, import the MedicaShop kit using Elementor/Envato's supported import path, and record exactly which templates/widgets fail or are marked Pro-only.

Do **not** install Elementor Pro merely because the kit advertises it. First classify the missing functionality:

- irrelevant retail/demo page → discard;
- Rosa can replace it with `rosa-medical-core`/child-theme rendering → custom replacement candidate;
- materially improves safe client editing or required shared dynamic presentation → Pro comparison candidate.

## Controlled Pro comparison

Only after a concrete Pro candidate exists:

```bash
export ROSA_GATE0_MODE=pro
export ROSA_MEDICASHOP_KIT_ZIP=/absolute/path/to/medicashop.zip
export ROSA_ELEMENTOR_PRO_ZIP=/absolute/path/to/elementor-pro.zip
bash wordpress/scripts/gate0-preflight.sh
bash wordpress/scripts/gate0-bootstrap.sh
```

Compare the exact same required Rosa templates/features. The comparison is evidence for a purchase decision; it is not itself authorization to buy anything.

## Runtime report

```bash
bash wordpress/scripts/gate0-version-report.sh > /tmp/rosa-gate0-runtime.md
```

## Reset

```bash
ROSA_GATE0_CONFIRM_RESET=yes bash wordpress/scripts/reset-local.sh
```

The reset command targets only the Compose project/volumes named for Rosa Medical Gate 0.
