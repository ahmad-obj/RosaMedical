param(
    [switch]$CreateCheckpoint
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "integration/catalogue-media-all-families"
$SourceRef = "origin/preview/punches-image-batch-01"

$repoRoot = (git rev-parse --show-toplevel).Trim()
if (-not $repoRoot) {
    throw "Run this script inside the RosaMedical repository."
}

Set-Location $repoRoot
$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch', found '$currentBranch'."
}

$paths = @(
    "apps/web/public/media/catalogue-preview",
    "apps/web/src/features/catalogue-media",
    "apps/web/src/features/catalogue-registry/products/scissors-batch-01.ts",
    "apps/web/src/features/catalogue-registry/products/chisels-batch-01.ts",
    "apps/web/src/features/catalogue-registry/products/cutters-batch-01.ts",
    "apps/web/src/features/catalogue-registry/products/knives-batch-01.ts",
    "apps/web/src/features/catalogue-registry/products/punches-batch-01.ts",
    "apps/web/scripts/catalogue_media_normalize.py",
    "apps/web/scripts/prepare_chisels_batch1.py",
    "apps/web/scripts/prepare_cutters_batch1.py",
    "apps/web/scripts/prepare_knives_batch1.py",
    "apps/web/scripts/prepare_punches_batch1.py",
    "apps/web/scripts/prepare_scissors_wave2.py",
    "apps/web/scripts/prepare_scissors_wave3.py",
    "apps/web/scripts/requirements-catalogue-media.txt",
    "apps/web/src/styles/scissors-image-preview.css",
    "apps/web/src/test/scissors-batch-01-inventory.test.ts",
    "apps/web/src/test/scissors-batch-01-media.test.ts",
    "apps/web/src/test/chisels-batch-01-inventory.test.ts",
    "apps/web/src/test/chisels-batch-01-approval.test.ts",
    "apps/web/src/test/chisels-image-preview.test.ts",
    "apps/web/src/test/cutters-batch-01-inventory.test.ts",
    "apps/web/src/test/cutters-batch-01-approval.test.ts",
    "apps/web/src/test/cutters-image-preview.test.ts",
    "apps/web/src/test/knives-batch-01-inventory.test.ts",
    "apps/web/src/test/knives-batch-01-media.test.ts",
    "apps/web/src/test/knives-batch-01-approval.test.ts",
    "apps/web/src/test/knives-image-preview.test.ts",
    "apps/web/src/test/punches-batch-01-inventory.test.ts",
    "apps/web/src/test/punches-batch-01-approval.test.ts",
    "apps/web/src/test/punches-image-preview.test.ts",
    "apps/web/tests/e2e/scissors-image-batch-01.spec.ts",
    "apps/web/tests/e2e/chisels-image-batch-01.spec.ts",
    "apps/web/tests/e2e/cutters-image-batch-01.spec.ts",
    "apps/web/tests/e2e/knives-image-batch-01.spec.ts",
    "apps/web/tests/e2e/punches-image-batch-01.spec.ts",
    "docs/review/catalogue-media",
    "docs/superpowers/completions/2026-08-02-scissors-batch-01-production-media.md",
    "docs/superpowers/completions/2026-08-03-chisels-batch-01-production-media.md",
    "docs/superpowers/completions/2026-08-04-knives-batch-01-completion.md",
    "docs/superpowers/completions/2026-08-04-punches-batch-01-completion.md"
)

function Test-AllowedTransferPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Candidate
    )

    $normalizedCandidate = $Candidate.Replace("\", "/")
    foreach ($allowedPath in $paths) {
        if (
            $normalizedCandidate -eq $allowedPath -or
            $normalizedCandidate.StartsWith("$allowedPath/")
        ) {
            return $true
        }
    }

    return $false
}

$statusLines = @(git status --porcelain=v1)
$unexpectedPaths = @()
foreach ($line in $statusLines) {
    if (-not $line) {
        continue
    }

    $candidate = $line.Substring(3).Trim()
    if ($candidate.Contains(" -> ")) {
        $candidate = ($candidate -split " -> ")[-1]
    }

    if (-not (Test-AllowedTransferPath -Candidate $candidate)) {
        $unexpectedPaths += $candidate
    }
}

if ($unexpectedPaths.Count -gt 0) {
    $formatted = $unexpectedPaths | Sort-Object -Unique | ForEach-Object { " - $_" }
    throw "Working tree contains changes outside the controlled transfer:`n$($formatted -join "`n")"
}

Write-Host "Fetching approved source branch..."
git fetch origin preview/punches-image-batch-01
if ($LASTEXITCODE -ne 0) {
    throw "Unable to fetch $SourceRef."
}

Write-Host "Restoring approved additive files only..."
& git checkout $SourceRef -- @paths
if ($LASTEXITCODE -ne 0) {
    throw "Controlled checkout from $SourceRef failed."
}

$requiredFiles = @(
    "apps/web/src/features/catalogue-media/index.ts",
    "apps/web/src/features/catalogue-media/types.ts",
    "apps/web/src/features/catalogue-media/scissors-batch-01-combined.ts",
    "apps/web/src/features/catalogue-media/chisels-batch-01.ts",
    "apps/web/src/features/catalogue-media/cutters-batch-01.ts",
    "apps/web/src/features/catalogue-media/knives-batch-01-approved.ts",
    "apps/web/src/features/catalogue-media/punches-batch-01-approved.ts",
    "apps/web/src/features/catalogue-registry/products/scissors-batch-01.ts",
    "apps/web/src/features/catalogue-registry/products/chisels-batch-01.ts",
    "apps/web/src/features/catalogue-registry/products/cutters-batch-01.ts",
    "apps/web/src/features/catalogue-registry/products/knives-batch-01.ts",
    "apps/web/src/features/catalogue-registry/products/punches-batch-01.ts"
)

$missingFiles = @(
    $requiredFiles | Where-Object {
        -not (Test-Path -LiteralPath (Join-Path $repoRoot $_) -PathType Leaf)
    }
)
if ($missingFiles.Count -gt 0) {
    $formatted = $missingFiles | ForEach-Object { " - $_" }
    throw "Controlled transfer is incomplete. Missing required files:`n$($formatted -join "`n")"
}

$mediaRoot = Join-Path $repoRoot "apps/web/public/media/catalogue-preview"
$avifCount = @(Get-ChildItem -Path $mediaRoot -Recurse -File -Filter "*.avif").Count
$webpCount = @(Get-ChildItem -Path $mediaRoot -Recurse -File -Filter "*.webp").Count

if ($avifCount -ne 103 -or $webpCount -ne 103) {
    throw "Expected 103 AVIF and 103 WebP files; found $avifCount AVIF and $webpCount WebP."
}

$stagedPaths = @(git diff --cached --name-only)
$unexpectedStagedPaths = @(
    $stagedPaths | Where-Object {
        -not (Test-AllowedTransferPath -Candidate $_)
    }
)
if ($unexpectedStagedPaths.Count -gt 0) {
    $formatted = $unexpectedStagedPaths | Sort-Object -Unique | ForEach-Object { " - $_" }
    throw "Controlled transfer staged unexpected paths:`n$($formatted -join "`n")"
}

$forbidden = @(
    "services/api",
    "packages/contracts/openapi",
    "apps/web/src/middleware.ts",
    "apps/web/src/proxy.ts",
    "apps/web/.env",
    "apps/web/.env.local"
)

foreach ($path in $stagedPaths) {
    foreach ($prefix in $forbidden) {
        if ($path -eq $prefix -or $path.StartsWith("$prefix/")) {
            throw "Controlled transfer touched forbidden path: $path"
        }
    }
}

Write-Host "Controlled transfer complete."
Write-Host "AVIF: $avifCount"
Write-Host "WebP: $webpCount"

if ($CreateCheckpoint) {
    if ($stagedPaths.Count -eq 0) {
        Write-Host "No transfer changes remain to commit; the checkpoint is already present."
    } else {
        Write-Host "Creating a local checkpoint commit..."
        git commit -m "chore: checkpoint approved catalogue media transfer"
        if ($LASTEXITCODE -ne 0) {
            throw "Unable to create the catalogue media checkpoint commit."
        }
        Write-Host "Checkpoint commit created."
    }
} else {
    Write-Host "Transfer files are staged."
    Write-Host "Run this script with -CreateCheckpoint to preserve them before further pulls."
}
