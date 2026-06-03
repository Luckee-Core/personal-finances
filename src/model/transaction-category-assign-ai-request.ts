export type TransactionCategoryAssignAiRequest = {
  id: string;
  transaction_id: string;
  ai_prompt_id: string | null;
  prompt_type: string;
  provider: string;
  model: string;
  request_payload_json: Record<string, unknown>;
  system_prompt: string;
  user_message: string;
  status: 'pending' | 'completed' | 'failed';
  exchange_id: string | null;
  created_at: string;
  updated_at: string;
};
