'use client'

import React, { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { toast } from 'sonner'
import { useUser } from '@/lib/stores/user'
import { Message, useMessage } from '@/lib/stores/messages'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'

export default function ChatInput() {
  const [text, setText] = useState<string | undefined>()
  const { user } = useUser()
  const { messages, addMessage, addOptimisticId, setActionMessage } =
    useMessage()

  const supabase = supabaseBrowser()

  const handleSendMessage = async () => {
    if (!text) return

    const { data, error } = await supabase
      .from('messages')
      .insert({ text })
      .select()
      .single()

    if (error) {
      toast.error(error.message)
    } else {
      const now = new Date().toISOString()
      const newMessage = {
        id: data.id,
        text,
        sent_by: user?.id,
        edited: false,
        created_at: now,
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          display_name: user?.user_metadata.user_name,
          created_at: now,
        },
      }
      addMessage(newMessage as Message)
      addOptimisticId(newMessage.id)
      setText('')
    }
  }

  return (
    <div className="p-5">
      <Textarea
        value={text}
        placeholder="Send message"
        onChange={(e) => {
          setText(e.currentTarget.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
          } else if (!text && e.key === 'ArrowUp') {
            document.getElementById('trigger-edit')?.click()
            setActionMessage(messages[messages.length - 1])
          }
        }}
      />
      <Button
        className="w-full mt-2"
        disabled={!text?.trim()}
        onClick={handleSendMessage}
      >
        Send message
      </Button>
    </div>
  )
}
