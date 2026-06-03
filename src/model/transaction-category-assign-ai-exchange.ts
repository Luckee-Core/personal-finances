export type TransactionCategoryAssignAiExchange = {
  id: string;
  transaction_id: string;
  request_id: string;
  response_id: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  model_used: string | null;
  status: 'pending' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
};
