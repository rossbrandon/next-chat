'use client'

import React from 'react'
import { Button } from './ui/button'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { MESSAGE_PAGE_SIZE } from '@/lib/constants'
import { getPageFromTo } from '@/lib/utils'
import { useMessage } from '@/lib/stores/messages'
import { toast } from 'sonner'

export default function LoadMoreMessages() {
  const { page, hasMorePages, addManyMessages } = useMessage()

  const fetchMore = async () => {
    const { from, to } = getPageFromTo(page, MESSAGE_PAGE_SIZE)
    const supabase = supabaseBrowser()
    const { data, error } = await supabase
      .from('messages')
      .select('*,users(*)')
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error(error.message)
    } else {
      addManyMessages(data.reverse())
    }
  }

  return (
    <>
      {hasMorePages && (
        <Button variant="outline" className="w-full" onClick={fetchMore}>
          Load more
        </Button>
      )}
    </>
  )
}
