import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AiPrompt } from '@/model/ai-prompt';

const initialState: Record<string, AiPrompt> = {};

export const aiPromptsSlice = createSlice({
  name: 'aiPrompts',
  initialState,
  reducers: {
    setAiPrompts: (_state, action: PayloadAction<Record<string, AiPrompt>>) => action.payload,
    upsertAiPrompt: (state, action: PayloadAction<AiPrompt>) => {
      state[action.payload.id] = action.payload;
    },
    removeAiPrompt: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const AiPromptsActions = aiPromptsSlice.actions;
export const aiPromptsReducer = aiPromptsSlice.reducer;
