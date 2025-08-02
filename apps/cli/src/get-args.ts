import pc from "picocolors";
import { promtQuestion } from "./utils";

const defaultValue = {
  packageManager: "bun",
  ui: "shadcn",
  auth: "clerk",
  framework: "next",
  database: "prisma",
  appName: "my-stack",
};

const packageManagers = [
  { label: pc.bold(pc.green("bun")) + pc.dim(" (fastest)"), value: "bun" },
  {
    label: pc.bold(pc.yellow("pnpm")) + pc.dim(" (disk-efficient)"),
    value: "pnpm",
  },
  {
    label: pc.bold(pc.white("npm")) + pc.dim(" (default for Node.js)"),
    value: "npm",
  },
  {
    label: pc.bold(pc.magenta("yarn")) + pc.dim(" (legacy usage)"),
    value: "yarn",
  },
];

const frameworks = [
  {
    label: pc.bold(pc.cyan("Next.js")) + pc.dim(" (React, Vercel-powered)"),
    value: "next",
  },
  {
    label: pc.bold(pc.green("Remix")) + pc.dim(" (React, nested routes)"),
    value: "remix",
  },
  {
    label:
      pc.bold(pc.red("TanStack Start")) +
      pc.dim(" (Lightweight, full-stack starter)"),
    value: "tanstack-start",
  },
];

const uiOptions = [
  {
    label: pc.bold(pc.cyan("ShadCN UI")) + pc.dim(" (Headless + Tailwind)"),
    value: "shadcn",
  },
  {
    label: pc.bold(pc.yellow("Hero UI")) + pc.dim(" (also known as NextUI)"),
    value: "hero",
  },
  {
    label: pc.italic(pc.gray("None (only Tailwind)")),
    value: "none",
  },
];

const authOptions = [
  {
    label: pc.bold(pc.green("Clerk")) + pc.dim(" (modern, plug & play)"),
    value: "clerk",
  },
  {
    label: pc.bold(pc.cyan("NextAuth")) + pc.dim(" (customizable NextAuth)"),
    value: "nextauth",
  },
  {
    label: pc.italic(pc.gray("None (I'll add my own later)")),
    value: "none",
  },
];

const dbOptions = [
  {
    label: pc.bold(pc.blue("Prisma + PostgreSQL")) + pc.dim(" (recommended)"),
    value: "prisma_postgres",
  },
  {
    label:
      pc.bold(pc.magenta("Mongoose + MongoDB")) +
      pc.dim(" (NoSQL, document DB)"),
    value: "mongoose_mongo",
  },
];

export async function getArg() {
  defaultValue.packageManager = await promtQuestion({
    message: pc.bold(pc.blue("Select a package manager:")),
    questionType: "MCQ",
    options: packageManagers,
  });

  defaultValue.framework = await promtQuestion({
    message: pc.bold(pc.blue("Choose a full-stack framework:")),
    questionType: "MCQ",
    options: frameworks,
  });

  defaultValue.ui = await promtQuestion({
    message: pc.bold(pc.blue("Choose a UI framework:")),
    questionType: "MCQ",
    options: uiOptions,
  });

  defaultValue.auth = await promtQuestion({
    message: pc.bold(pc.blue("Choose an authentication provider:")),
    questionType: "MCQ",
    options: authOptions,
  });

  defaultValue.database = await promtQuestion({
    message: pc.bold(pc.blue("Choose a database setup:")),
    questionType: "MCQ",
    options: dbOptions,
  });

  defaultValue.appName = await promtQuestion({
    message: pc.bold(pc.blue("Enter your app name:")),
    questionType: "TEXT",
  });

  return defaultValue;
}
