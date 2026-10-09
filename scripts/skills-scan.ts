/**
 * Scan every agent skill of this repo with NVIDIA SkillSpector (static analysis, no LLM),
 * one summary line per skill. Report only: SkillSpector's keyword rules flag code samples
 * and prose (accepted false positives are listed in AGENTS.md), so a HIGH score means
 * "read the findings", not "reject". Details: `skillspector scan <dir> --no-llm`.
 *
 * Run: `mise run skills:scan`
 */
import { Glob } from "bun";

// pinned: SkillSpector has no release tags yet
const SKILLSPECTOR =
  "git+https://github.com/NVIDIA/skillspector.git@2f93a8624f62ad8c9f641580ea52d68ac20cd3f2";

const dirs = [".claude/skills", "plugins/cdviz/skills"]
  .flatMap((root) =>
    [...new Glob("*/SKILL.md").scanSync({ cwd: root })].map(
      (f) => `${root}/${f.replace(/\/SKILL\.md$/, "")}`,
    ),
  )
  .sort();

for (const dir of dirs) {
  const proc = Bun.spawnSync(
    ["uvx", "--from", SKILLSPECTOR, "skillspector", "scan", dir, "--no-llm", "--format", "json"],
    { stderr: "ignore" },
  );
  let line: string;
  try {
    const report = JSON.parse(proc.stdout.toString());
    const risk = report.risk_assessment ?? {};
    const high = (report.issues ?? []).filter((i: { severity: string }) =>
      ["HIGH", "CRITICAL"].includes(i.severity),
    );
    line = `score=${risk.score} ${risk.recommendation} high=${high.length} issues=${(report.issues ?? []).length}`;
  } catch {
    line = `scan failed (exit ${proc.exitCode})`;
  }
  console.log(`${dir.padEnd(48)} ${line}`);
}
