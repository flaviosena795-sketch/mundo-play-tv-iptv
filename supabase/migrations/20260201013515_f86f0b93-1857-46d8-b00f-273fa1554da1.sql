-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Deny anon access" ON public.payments;
DROP POLICY IF EXISTS "Deny authenticated access" ON public.payments;

-- Create explicit policies with proper role targeting
-- These policies deny direct access to anon and authenticated users
-- Service role bypasses RLS automatically in Supabase

CREATE POLICY "Deny anon access to payments"
ON public.payments
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny authenticated access to payments"
ON public.payments
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);