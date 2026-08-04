$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "integration/catalogue-media-all-families"
$repoRoot = (git rev-parse --show-toplevel).Trim()
if (-not $repoRoot) {
    throw "Run this script inside the RosaMedical repository."
}

Set-Location $repoRoot
$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch', found '$currentBranch'."
}

$workingTreeChanges = @(git status --porcelain=v1)
if ($workingTreeChanges.Count -gt 0) {
    throw "Verification requires a clean, checkpointed working tree. Run tools/integrate-approved-catalogue-media.ps1 -CreateCheckpoint first, then push the checkpoint before verification."
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Label,
        [Parameter(Mandatory = $true)]
        [scriptblock]$Command
    )

    Write-Host ""
    Write-Host "=== $Label ==="
    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "$Label failed with exit code $LASTEXITCODE."
    }
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
    throw "Catalogue media transfer is absent or incomplete. Missing required files:`n$($formatted -join "`n")`nRun tools/integrate-approved-catalogue-media.ps1 -CreateCheckpoint before verification."
}

$mediaRoot = Join-Path $repoRoot "apps/web/public/media/catalogue-preview"
if (-not (Test-Path -LiteralPath $mediaRoot -PathType Container)) {
    throw "Catalogue media directory is missing: apps/web/public/media/catalogue-preview. Run tools/integrate-approved-catalogue-media.ps1 -CreateCheckpoint before verification."
}

$avifCount = @(Get-ChildItem -Path $mediaRoot -Recurse -File -Filter "*.avif").Count
$webpCount = @(Get-ChildItem -Path $mediaRoot -Recurse -File -Filter "*.webp").Count
if ($avifCount -ne 103 -or $webpCount -ne 103) {
    throw "Expected 103 AVIF and 103 WebP files; found $avifCount AVIF and $webpCount WebP. Run the controlled transfer checkpoint again before verification."
}

$focusedTests = @(
    "src/test/scissors-batch-01-inventory.test.ts",
    "src/test/scissors-batch-01-media.test.ts",
    "src/test/scissors-image-preview.test.ts",
    "src/test/chisels-batch-01-inventory.test.ts",
    "src/test/chisels-batch-01-media.test.ts",
    "src/test/chisels-batch-01-approval.test.ts",
    "src/test/chisels-image-preview.test.ts",
    "src/test/cutters-batch-01-inventory.test.ts",
    "src/test/cutters-batch-01-media.test.ts",
    "src/test/cutters-batch-01-approval.test.ts",
    "src/test/cutters-image-preview.test.ts",
    "src/test/knives-batch-01-inventory.test.ts",
    "src/test/knives-batch-01-media.test.ts",
    "src/test/knives-batch-01-approval.test.ts",
    "src/test/knives-image-preview.test.ts",
    "src/test/punches-batch-01-inventory.test.ts",
    "src/test/punches-batch-01-media.test.ts",
    "src/test/punches-batch-01-approval.test.ts",
    "src/test/punches-image-preview.test.ts",
    "src/test/catalogue-registry.test.ts",
    "src/test/f3b-page-composition.test.tsx",
    "src/test/admin-media.test.tsx",
    "src/test/inquiry-preview.test.tsx"
)

$e2eSpecs = @(
    "tests/e2e/scissors-image-batch-01.spec.ts",
    "tests/e2e/chisels-image-batch-01.spec.ts",
    "tests/e2e/cutters-image-batch-01.spec.ts",
    "tests/e2e/knives-image-batch-01.spec.ts",
    "tests/e2e/punches-image-batch-01.spec.ts"
)

Invoke-Checked -Label "Focused catalogue integration tests" -Command {
    & pnpm --filter @rosa/web test -- @focusedTests
}
Invoke-Checked -Label "Workspace lint" -Command {
    & pnpm lint
}
Invoke-Checked -Label "Workspace typecheck" -Command {
    & pnpm typecheck
}
Invoke-Checked -Label "Complete web test suite" -Command {
    & pnpm --filter @rosa/web test
}
Invoke-Checked -Label "Production web build" -Command {
    & pnpm --filter @rosa/web build
}
Invoke-Checked -Label "All five catalogue media E2E specifications" -Command {
    & pnpm --filter @rosa/web test:e2e -- @e2eSpecs
}

$forbidden = @(
    "services/api",
    "packages/contracts/openapi",
    "apps/web/src/middleware.ts",
    "apps/web/src/proxy.ts",
    "apps/web/.env",
    "apps/web/.env.local"
)

$changedPaths = @(git diff --name-only main...HEAD) | Sort-Object -Unique

foreach ($path in $changedPaths) {
    foreach ($prefix in $forbidden) {
        if ($path -eq $prefix -or $path.StartsWith("$prefix/")) {
            throw "Integration diff contains forbidden path: $path"
        }
    }
}

Write-Host ""
Write-Host "Catalogue media integration verification passed."
Write-Host "AVIF: $avifCount"
Write-Host "WebP: $webpCount"
Write-Host "No forbidden backend, OpenAPI, middleware/proxy, or environment paths were detected."
