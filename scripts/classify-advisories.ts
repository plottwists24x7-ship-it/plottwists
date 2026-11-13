import { execSync } from "child_process";
import fs from "fs";

function run() {
  console.log("=== CLASSIFYING DEPENDENCY ADVISORIES ===");
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  const prodDeps = Object.keys(pkg.dependencies || {});
  const devDeps = Object.keys(pkg.devDependencies || {});

  let auditRaw = "";
  try {
    auditRaw = execSync("npm audit --json", { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] });
  } catch (err: any) {
    auditRaw = err.stdout || "";
  }

  const audit = JSON.parse(auditRaw);
  const vulnerabilities = audit.vulnerabilities || {};
  
  const classified = {
    productionRuntime: [] as any[],
    buildTimeDevOnly: [] as any[],
  };

  for (const [pkgName, details] of Object.entries(vulnerabilities) as [string, any][]) {
    const isDirectProd = prodDeps.includes(pkgName);
    const isDirectDev = devDeps.includes(pkgName);
    
    // Check paths to see top-level root
    const nodes = details.nodes || [];
    const effects = details.effects || [];
    const severity = details.severity;
    const via = details.via;

    const entry = {
      package: pkgName,
      severity,
      isDirectProd,
      isDirectDev,
      effects,
      nodesCount: nodes.length,
    };

    if (isDirectProd) {
      classified.productionRuntime.push(entry);
    } else {
      classified.buildTimeDevOnly.push(entry);
    }
  }

  console.log(`Total Vulnerability Keys: ${Object.keys(vulnerabilities).length}`);
  console.log(`Production Runtime Vulnerabilities: ${classified.productionRuntime.length}`);
  console.log(`Build-Time / Dev-Only Vulnerabilities: ${classified.buildTimeDevOnly.length}`);
  console.log("\n--- Build-Time / Dev-Only Breakdown ---");
  classified.buildTimeDevOnly.forEach(item => {
    console.log(`  - [${item.severity.toUpperCase()}] ${item.package} (effects: ${item.effects.join(", ") || "none"})`);
  });

  if (classified.productionRuntime.length > 0) {
    console.log("\n--- Production Runtime Breakdown ---");
    classified.productionRuntime.forEach(item => {
      console.log(`  - [${item.severity.toUpperCase()}] ${item.package}`);
    });
  }
}

run();

