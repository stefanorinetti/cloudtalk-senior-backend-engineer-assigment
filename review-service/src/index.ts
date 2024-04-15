import { consumerConnect } from './consumer';

async function main() {
  await consumerConnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});