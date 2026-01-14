-- AI Analytics - Safe Query Executor
-- This function allows superadmin to execute read-only SELECT queries

CREATE OR REPLACE FUNCTION execute_readonly_query(query_text text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_json json;
  lower_query text;
BEGIN
  -- Additional safety check: ensure it's a SELECT or WITH clause
  lower_query := lower(trim(query_text));
  
  IF NOT (lower_query LIKE 'select%' OR lower_query LIKE 'with%') THEN
    RAISE EXCEPTION 'Only SELECT queries (including WITH clauses) are allowed';
  END IF;
  
  -- Execute the query and convert to JSON
  EXECUTE format('SELECT json_agg(row_to_json(t)) FROM (%s) t', query_text) INTO result_json;
  
  RETURN COALESCE(result_json, '[]'::json);
END;
$$;

-- Grant execute permission to authenticated users (will be further restricted by is_superadmin check in API)
GRANT EXECUTE ON FUNCTION execute_readonly_query(text) TO authenticated;

-- Add comment
COMMENT ON FUNCTION execute_readonly_query IS 'Executes read-only SELECT queries for AI analytics. Restricted to superadmin via API layer.';
