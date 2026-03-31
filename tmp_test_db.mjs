import { createClient } from "@libsql/client";

function getClientFromEnv() {
  const rawUrl = process.env.DATABASE_URL || "file:local.db";
  let url = rawUrl;
  if (url.startsWith("libsql://")) {
    url = "https://" + url.slice("libsql://".length);
  }
  const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;
  return { url, authToken };
}

(async () => {
  const { url, authToken } = getClientFromEnv();
  console.log(
    "tmp_test_db: using",
    url,
    authToken ? "(auth token set)" : "(no auth token)",
  );
  const client = createClient({ url, authToken });
  try {
    const r = await client.execute({ sql: "SELECT 1 as ok" });
    console.log("tmp_test_db: success rows:", r.rows);
  } catch (err) {
    console.error(
      "tmp_test_db: error message:",
      err && err.message ? err.message : String(err),
    );
    try {
      console.error("tmp_test_db: full error:", err);
    } catch (e) {}
    process.exitCode = 2;
  }
})();
