import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationsState, Conversation } from '@/types';

const initialState: ConversationsState = {
  conversations: [],
  selectedConversationId: null,
  loading: false,
  error: null,
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.loading = false;
    },
    selectConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversationId = action.payload;
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.conversations[index] = action.payload;
      } else {
        state.conversations.unshift(action.payload);
      }
    },
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c._id === action.payload);
      if (conversation) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    },
    resetUnreadCount: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(c => c._id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
  },
});

export const {
  setConversations,
  selectConversation,
  updateConversation,
  incrementUnreadCount,
  resetUnreadCount,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
