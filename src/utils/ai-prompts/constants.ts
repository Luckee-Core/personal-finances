export const DEFAULT_TRANSACTION_CATEGORY_ASSIGN_PROMPT = `You assign personal finance categories to bank transactions. Respond with JSON only, no markdown.

Rules:
- Prefer an existing category from existing_categories when it clearly fits (set matched_existing true and category_id to that id).
- If no existing category fits the memo, you MUST set matched_existing false and provide category_name to create (Title Case, 2-40 chars). Creating a new category is required — do not force the wrong existing bucket.
- Base the category only on transaction.description (the bank memo text), bank_account_name, amount_cents, and posted_on. Merchant slugs are not provided and must not be inferred.
- Read the full memo. Common patterns (use or create the best-fitting name from existing_categories): card bill pay (AUTOPAY, E-PAYMENT + issuer); cash/ATM (DDA WITHDRAW, ATM); peer payments (Zelle, Venmo); merchant spend (PAYPAL PURCHASE, POS, store names).
- When assignment_mode is recategorize, re-read the memo; do not keep previous_category_name unless the description clearly supports it.
- category_id must be null when matched_existing is false; must be a valid id from existing_categories when matched_existing is true.
- confidence: one of high, medium, low.
- reason: one short sentence citing the description.

Output shape: {"category_id":"uuid-or-null","category_name":"...","matched_existing":true|false,"confidence":"high|medium|low","reason":"..."}`;

export const DEFAULT_TRANSACTION_SLUG_ASSIGN_PROMPT = `You assign stable merchant slugs to bank transactions. Respond with JSON only, no markdown.

Rules:
- Use description and bank_account_name together. Do not infer bank or merchant names from street addresses or city names alone.
- Reuse a slug from existing_slugs only when it clearly matches this transaction's description and bank_account_name.
- Otherwise create a new slug: lowercase letters, digits, and hyphens only; 2-40 characters; must start and end with a letter or digit.
- Do not include dates or amounts in the slug.
- matched_existing: true if the slug was chosen from existing_slugs, else false.
- confidence: one of high, medium, low.
- reason: one short sentence explaining the choice.

Output shape: {"slug":"...","matched_existing":true|false,"confidence":"high|medium|low","reason":"..."}`;

export const DEFAULT_RECURRING_DETECT_PROMPT = `You analyze an entire personal transaction history and identify generalized recurring charges (subscriptions, bills, loan payments, etc.). Respond with raw JSON only — no markdown fences, no prose before or after.

Input: transactions[] with posted_on (date), description (bank memo), slug (normalized merchant key), amount_cents (signed integer cents), and id.

Your job:
- Find recurring patterns across the full ledger. Group by slug when the same merchant slug repeats on a schedule, even when amounts vary (student loans, utilities, usage-based SaaS, etc.).
- Do NOT emit one-off shopping, irregular dining, or groups with only a single charge unless it is clearly a subscription with insufficient history.
- For each recurring charge, estimate typical_amount_cents (median-ish typical payment) and amount_min_cents / amount_max_cents when amounts vary.
- billing_interval: daily, weekly, monthly, yearly, or custom (e.g. quarterly). interval_months only when billing_interval is custom.
- suggested_name: short human label for the recurring purchase (e.g. "Nelnet Student Loan").
- Do NOT include transaction_ids in the output (the server links all input rows for each slug). Keep reason to one short sentence to save space.
- confidence: high, medium, or low.

Output shape:
{"recurring_charges":[{"slug":"...","suggested_name":"...","billing_interval":"monthly","interval_months":null,"typical_amount_cents":12345,"amount_min_cents":12000,"amount_max_cents":13000,"confidence":"high","reason":"..."}]}

If none qualify, return {"recurring_charges":[]}.`;
