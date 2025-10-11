import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessagesState, Message } from '@/types';

const initialState: MessagesState = {
  messagesByConversation: {},
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      state.messagesByConversation[action.payload.conversationId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { conversationId } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const { conversationId, _id } = action.payload;
      const messages = state.messagesByConversation[conversationId];
      if (messages) {
        const index = messages.findIndex(m => m._id === _id);
        if (index !== -1) {
          messages[index] = action.payload;
        }
      }
    },
    deleteMessage: (state, action: PayloadAction<{ conversationId: string; messageId: string }>) => {
      const messages = state.messagesByConversation[action.payload.conversationId];
      if (messages) {
        const index = messages.findIndex(m => m._id === action.payload.messageId);
        if (index !== -1) {
          messages[index].deleted = true;
        }
      }
    },
  },
});

export const { setMessages, addMessage, updateMessage, deleteMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
