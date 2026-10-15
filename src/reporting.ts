/**
 * nomad.ax reports its own uncaught errors (launch workstream S7; nomad-shell
 * docs/operations/error-intake.md): a scrubbed one-line message and a hash of the stack, never the
 * stack, a URL's query or anything about the person. Imported first by every page's client entry.
 * `report.ts` is nomad-shell's supabase/functions/_shared/report.ts, copied as it is.
 */
import { installBrowserReporter } from './report';

installBrowserReporter({ product: 'nomad-site', version: (import.meta.env.VITE_SITE_VERSION as string | undefined) ?? 'web' });
