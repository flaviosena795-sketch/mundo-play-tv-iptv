-- Add explicit deny policies to protect the payments table from client-side access
-- Only service role should have access (for backend edge functions)

-- Deny all access for anonymous users
CREATE POLICY "Deny anon access" ON public.payments
FOR ALL TO anon USING (false) WITH CHECK (false);

-- Deny all access for authenticated users  
CREATE POLICY "Deny authenticated access" ON public.payments
FOR ALL TO authenticated USING (false) WITH CHECK (false);