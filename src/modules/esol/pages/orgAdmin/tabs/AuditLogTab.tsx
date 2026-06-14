/**
 * Dashboard Audit Log tab — Final Addendum §6.
 *
 * Renders the full <AuditLog /> page in embedded mode so the tab
 * gets the filter bar + table + PDF export without the page-level
 * header that the standalone route would show.
 */

import AuditLog from "../AuditLog";

export default function AuditLogTab() {
  return <AuditLog embedded />;
}
