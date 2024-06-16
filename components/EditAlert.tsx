'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Message, useMessage } from '@/lib/stores/messages'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { useState } from 'react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

export function EditAlert() {
  const [text, setText] = useState<string | undefined>()
  const { actionMessage } = useMessage()
  const { optimisticUpdateMessage } = useMessage()

  const handleEdit = async () => {
    const supabase = supabaseBrowser()

    if (text) {
      const { error } = await supabase
        .from('messages')
        .update({ text, edited: true })
        .eq('id', actionMessage?.id!)

      if (error) {
        toast.error(error.message)
      } else {
        optimisticUpdateMessage({
          ...actionMessage,
          text,
          edited: true,
        } as Message)
        toast.success('Message edited')
      }
      document.getElementById('trigger-edit')?.click()
    } else {
      document.getElementById('trigger-edit')?.click()
      document.getElementById('trigger-delete')?.click()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Textarea
          defaultValue={actionMessage?.text}
          onChange={(e) => {
            setText(e.currentTarget.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleEdit()
            }
          }}
        />
        <DialogFooter>
          <Button type="submit" className="w-full" onClick={handleEdit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
