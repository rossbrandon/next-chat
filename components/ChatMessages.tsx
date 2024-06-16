import React, { Suspense } from 'react'
import MessageList from './MessageList'
import { supabaseServer } from '@/lib/supabase/server'
import InitMessages from '@/lib/stores/InitMessages'
import { PulseLoader } from 'react-spinners'
import { MESSAGE_PAGE_SIZE } from '@/lib/constants'
import { toast } from 'sonner'
import { getPageFromTo } from '@/lib/utils'

export default async function ChatMessages() {
  const { from, to } = getPageFromTo(0, MESSAGE_PAGE_SIZE)
  const supabase = await supabaseServer()
  const { data, error } = await supabase
    .from('messages')
    .select('*,users(*)')
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) {
    toast.error(error.message)
  }

  return (
    <Suspense fallback={<PulseLoader />}>
      <MessageList />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  )
}
