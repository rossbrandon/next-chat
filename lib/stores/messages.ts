import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

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
  messages: Message[]
  actionMessage: Message | undefined
  optimisticIds: string[]
  addMessage: (message: Message) => void
  setActionMessage: (message: Message | undefined) => void
  optimisticDeleteMessage: (messageId: string) => void
  optimisticUpdateMessage: (message: Message) => void
  addOptimisticId: (id: string) => void
}

export const useMessage = create<MessageState>()((set) => ({
  messages: [],
  actionMessage: undefined,
  optimisticIds: [],
  addMessage: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
  addOptimisticId: (id) =>
    set((state) => ({
      optimisticIds: [...state.optimisticIds, id],
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
