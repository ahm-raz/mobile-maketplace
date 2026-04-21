-- Single statement: CLI may send each migration as one prepared statement.
-- Runs after 20260417000003 (function) and 20260417000004 (device_testing).
DO $$
BEGIN
	EXECUTE 'REVOKE ALL ON FUNCTION public.create_warranty_claim_atomic(uuid, uuid, text) FROM PUBLIC';
	EXECUTE 'GRANT EXECUTE ON FUNCTION public.create_warranty_claim_atomic(uuid, uuid, text) TO service_role';
	EXECUTE 'COMMENT ON FUNCTION public.create_warranty_claim_atomic(uuid, uuid, text) IS ' ||
		quote_literal('Creates a claim and sets warranty to claimed in one transaction; service_role only.');
END;
$$;
