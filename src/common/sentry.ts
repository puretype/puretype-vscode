import * as Sentry from "@sentry/node";

import { version } from "./version";

const SENTRY_DSN =
  "https://c373fe35bd1a0c7b018e8c679b88a79d@o4506809820971008.ingest.us.sentry.io/4507766380298240";

export function initialiseSentry(): void {
  const isProd = process.env.NODE_ENV === "production";

  Sentry.init({
    dsn: SENTRY_DSN,
    release: version,
    debug: !isProd,
    environment: isProd ? "production" : "development",

    beforeSend: (event, hint) => {
      return isProd ? event : null;
    },
  });
}
