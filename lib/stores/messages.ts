import { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { MESSAGE_PAGE_SIZE } from '../constants'

export type Message = {
  created_at: string
  edited: boolean
  id: string
  sent_by: string
  text: string
  users: {
    avatar_url: string
    created_at: string
    display_name: string
    id: string
  } | null
}

interface MessageState {
  page: number
  hasMorePages: boolean
  messages: Message[]
  actionMessage: Message | undefined
  optimisticIds: string[]
  addMessage: (newMessage: Message) => void
  addManyMessages: (newMessages: Message[]) => void
  addOptimisticId: (messageId: string) => void
  setActionMessage: (message: Message | undefined) => void
  optimisticDeleteMessage: (messageId: string) => void
  optimisticUpdateMessage: (updatedMessage: Message) => void
}

export const useMessage = create<MessageState>()((set) => ({
  page: 1,
  hasMorePages: false,
  messages: [],
  actionMessage: undefined,
  optimisticIds: [],
  addMessage: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
  addManyMessages: (newMessages) =>
    set((state) => ({
      messages: [...newMessages, ...state.messages],
      page: state.page + 1,
      hasMorePages: newMessages.length >= MESSAGE_PAGE_SIZE,
    })),
  addOptimisticId: (messageId) =>
    set((state) => ({
      optimisticIds: [...state.optimisticIds, messageId],
    })),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
      }
    }),
  optimisticUpdateMessage: (updatedMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id === updatedMessage.id) {
            message.text = updatedMessage.text
            message.edited = true
          }
          return message
        }),
      }
    }),
}))
