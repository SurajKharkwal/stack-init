import { addEnv, addPackage, mv } from "@/lib/file-handler";
import type { PACKAGE_MANAGER } from "@/types/index";

const dependencies = ["@clerk/nextjs"];
const env = [
  "# clerk js enviroment variables",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=",
  "CLERK_SECRET_KEY=YOUR_SECRET_KEY=",
  "CLERK_WEBHOOK_SIGNING_SECRET=whsec_123=",
];

export async function setupConfig(pm: PACKAGE_MANAGER, appName: string) {
  addEnv(env);

  addPackage(pm, dependencies);

  mv("./src/layout.tsx.txt", `${appName}/src/app/layout.tsx`);
  mv("./src/middleware.ts.txt", `${appName}/src/middleware.ts`);
  mv("./src/route.ts.txt", `${appName}/src/app/api/webhook/clerk/route.ts`);
  mv(
    "./src/sign-in.tsx.txt",
    `${appName}/src/app/sign-in/[[...sign-in]]/page.tsx`,
  );
  mv(
    "./src/sign-up.tsx.txt",
    `${appName}/src/app/sign-up/[[...sign-up]]/page.tsx`,
  );
}
