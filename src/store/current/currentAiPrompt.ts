import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AiPrompt } from '@/model/ai-prompt';

export const currentAiPromptSlice = createSlice({
  name: 'currentAiPrompt',
  initialState: null as AiPrompt | null,
  reducers: {
    setCurrentAiPrompt: (_state, action: PayloadAction<AiPrompt | null>) => action.payload,
    patchCurrentAiPrompt: (state, action: PayloadAction<Partial<AiPrompt>>) => {
      if (!state) return state;
      return { ...state, ...action.payload };
    },
    clearCurrentAiPrompt: () => null,
  },
});

export const CurrentAiPromptActions = currentAiPromptSlice.actions;
export const currentAiPromptReducer = currentAiPromptSlice.reducer;
