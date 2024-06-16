import React from 'react'
import ChatHeader from '@/components/ChatHeader'
import { supabaseServer } from '@/lib/supabase/server'
import InitUser from '@/lib/stores/InitUser'
import ChatInput from '@/components/ChatInput'
import ChatMessages from '@/components/ChatMessages'

export default async function Page() {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col relative">
          <ChatHeader user={user} />
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
      <InitUser user={user} />
    </>
  )
}
