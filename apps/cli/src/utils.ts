import { spinner } from "@clack/prompts";
import { spawnSync } from "child_process";
import spawn from "cross-spawn";
import { select, confirm, text, isCancel } from "@clack/prompts";

export type QUESTION =
  | {
      questionType: "MCQ";
      message: string;
      options: { label: string; value: string }[];
    }
  | {
      questionType: "TEXT" | "Y|N";
      message: string;
    };

const PACKAGE_MANAGERS = ["bun", "npm", "pnpm", "yarn"] as const;

function isInstalled(cmd: string): boolean {
  return (
    spawnSync(cmd, ["--version"], {
      shell: true,
      stdio: "ignore",
    }).status === 0
  );
}

export async function askForPackageManager() {
  const s = spinner();
  s.start("Checking available package managers...");

  // Step 1: Check which are installed
  const results = PACKAGE_MANAGERS.map((name) => ({
    name,
    available: isInstalled(name),
  }));

  s.stop("Check complete.");

  // Step 2: Build options with label + disabled if not available
  const options = results.map((pm) => ({
    label: pm.available
      ? `✅ ${pm.name} (available)`
      : `❌ ${pm.name} (not installed)`,
    value: pm.name,
    disabled: !pm.available,
  }));

  // Step 3: Prompt
  const selected = await promtQuestion<string>({
    message: "Choose a package manager",
    questionType: "MCQ",
    options,
  });

  console.log(`✅ You selected: ${selected}`);

  const found = results.find((pm) => pm.name === selected);

  if (!found?.available) {
    console.log(
      `The selected package manager "${selected}" is not available. Please install it or choose another.`,
    );
    process.exit(0);
  }
  return selected;
}
export async function promtQuestion<T = string | boolean>(
  question: QUESTION,
): Promise<T> {
  let result;

  switch (question.questionType) {
    case "MCQ":
      result = await select({
        message: question.message,
        options: question.options!,
      });
      break;
    case "Y|N":
      result = await confirm({ message: question.message });
      break;
    case "TEXT":
      result = await text({ message: question.message });
      break;
    default:
      throw new Error("Invalid question type");
  }

  if (isCancel(result)) {
    console.log("\n❌ Prompt cancelled. Exiting...");
    process.exit(0);
  }

  return result as T;
}

export async function runCommand(command: string) {
  const parts = command.trim().split(" ").filter(Boolean); // removes empty strings

  if (!parts[0]) {
    console.error("❌ Invalid command: empty or malformed");
    process.exit(1);
  }

  const proc = spawn.sync(parts[0], parts.slice(1), {
    stdio: "inherit",
    shell: true,
  });

  if (proc.status !== 0) {
    console.error(`❌ Command failed: ${command}`);
    process.exit(1);
  }
}

export async function runScript(scriptPath: string) {
  try {
    const mod = await import(`${process.cwd()}/${scriptPath}`);
    if (typeof mod.default === "function") {
      await mod.default();
    }
  } catch (error) {
    console.error(`❌ Failed to run script: ${scriptPath}`, error);
    process.exit(1);
  }
}
