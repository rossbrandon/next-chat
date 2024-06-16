import React, { Suspense } from 'react'
import MessageList from './MessageList'
import { supabaseServer } from '@/lib/supabase/server'
import InitMessages from '@/lib/stores/InitMessages'
import { PulseLoader } from 'react-spinners'

export default async function ChatMessages() {
  const supabase = await supabaseServer()
  const { data } = await supabase.from('messages').select('*,users(*)')

  return (
    <Suspense fallback={<PulseLoader />}>
      <MessageList />
      <InitMessages messages={data || []} />
    </Suspense>
  )
}
