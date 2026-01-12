-- Remove the overly permissive service role policy
DROP POLICY IF EXISTS "Service role can manage payments" ON public.payments;

-- The deny policies for anon and authenticated are correct and should remain
-- Payments should only be accessible via backend edge functions using service_role key
-- No additional policies needed - the deny policies will block all direct access