// SQL Safety Validator - Ensures only safe read-only queries
export interface ValidationResult {
  safe: boolean;
  reason?: string;
}

export function validateSQLSafety(sql: string): ValidationResult {
  const lowerSQL = sql.toLowerCase().trim();
  
  // 1. Must start with SELECT
  if (!lowerSQL.startsWith('select')) {
    return { 
      safe: false, 
      reason: 'Only SELECT queries are allowed' 
    };
  }
  
  // 2. Blacklist dangerous keywords
  const forbiddenKeywords = [
    'insert', 'update', 'delete', 'drop', 'alter',
    'grant', 'revoke', 'truncate', 'create', 'replace',
    'exec', 'execute', 'call', 'pragma'
  ];
  
  for (const keyword of forbiddenKeywords) {
    const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
    if (pattern.test(sql)) {
      return { 
        safe: false, 
        reason: `Forbidden keyword detected: ${keyword.toUpperCase()}` 
      };
    }
  }
  
  // 3. Block PII columns
  const piiColumns = ['email', 'phone', 'dob', 'date_of_birth'];
  for (const column of piiColumns) {
    const pattern = new RegExp(`\\b${column}\\b`, 'i');
    if (pattern.test(sql)) {
      return { 
        safe: false, 
        reason: `PII column not allowed: ${column}` 
      };
    }
  }
  
  // 4. Block certain sensitive tables
  const blockedTables = ['auth.users'];
  for (const table of blockedTables) {
    if (lowerSQL.includes(table.toLowerCase())) {
      return { 
        safe: false, 
        reason: `Access to ${table} is not permitted` 
      };
    }
  }
  
  // 5. Require reasonable LIMIT (optional but recommended)
  if (!lowerSQL.includes('limit') && lowerSQL.length > 200) {
    console.warn('Query without LIMIT clause detected - may return large dataset');
  }
  
  return { safe: true };
}

// Clean and normalize SQL
export function normalizeSQL(sql: string): string {
  return sql
    .trim()
    .replace(/;\s*$/, '') // Remove trailing semicolon
    .replace(/\s+/g, ' '); // Normalize whitespace
}
