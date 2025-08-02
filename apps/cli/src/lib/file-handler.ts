import { promises as fs } from "fs";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import type { PACKAGE_MANAGER } from "@/types";

// Support __dirname in ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Move a file from `src` to `dest`, resolving relative to the script's root.
 * If destination file exists, it is deleted.
 * Fallback to copy + unlink on rename failure (e.g., cross-device).
 */
export async function mv(src: string, dest: string) {
  const absSrc = path.resolve(__dirname, "../../", src);
  const absDest = path.resolve(__dirname, "../../", dest);

  try {
    await fs.mkdir(path.dirname(absDest), { recursive: true });

    // Delete target if it exists
    try {
      await fs.unlink(absDest);
    } catch {
      // No need to delete if doesn't exist
    }

    try {
      await fs.rename(absSrc, absDest);
    } catch {
      // Rename failed (maybe cross-device) – fallback to copy+unlink
      await fs.copyFile(absSrc, absDest);
      await fs.unlink(absSrc);
    }

    console.log(`✅ Moved: ${src} -> ${dest}`);
  } catch (err) {
    console.error(`❌ Failed to move ${src} -> ${dest}:`, err);
  }
}

export async function addEnv(lines: string[], filePath = ".env.example") {
  const absPath = path.resolve(process.cwd(), filePath); // Resolve from current working directory

  try {
    await fs.appendFile(absPath, "\n" + lines.join("\n") + "\n");
    console.log(`✅ Appended ${lines.length} lines to ${filePath}`);
  } catch (err) {
    console.error(`❌ Failed to append to ${filePath}:`, err);
  }
}

/**
 * Install dependencies using the given package manager.
 */
export function addPackage(pm: PACKAGE_MANAGER, packages: string[]) {
  if (!packages.length) return;

  const commands: Record<PACKAGE_MANAGER, string[]> = {
    bun: ["add"],
    npm: ["install"],
    yarn: ["add"],
    pnpm: ["add"],
  };

  const args = [...commands[pm], ...packages];
  const proc = spawn(pm, args, { stdio: "inherit" });

  proc.on("close", (code) => {
    if (code !== 0) {
      console.error(`❌ Failed to install packages with ${pm}`);
    } else {
      console.log(`✅ Installed: ${packages.join(", ")}`);
    }
  });
}
