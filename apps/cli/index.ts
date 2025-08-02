import { getArg } from "./src/get-args";

async function main() {
  console.log(await getArg());
}

main().catch();
