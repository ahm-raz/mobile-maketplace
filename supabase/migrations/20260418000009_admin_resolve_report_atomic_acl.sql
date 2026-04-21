-- Single statement for Supabase CLI (prepared statement per migration file).
DO $$
BEGIN
	EXECUTE 'REVOKE ALL ON FUNCTION public.admin_resolve_report_atomic(uuid, public.report_status, uuid) FROM PUBLIC';
	EXECUTE 'GRANT EXECUTE ON FUNCTION public.admin_resolve_report_atomic(uuid, public.report_status, uuid) TO service_role';
	EXECUTE 'COMMENT ON FUNCTION public.admin_resolve_report_atomic(uuid, public.report_status, uuid) IS ' ||
		quote_literal('Updates a moderation report and inserts an audit row in one transaction; service_role only.');
END;
$$;
