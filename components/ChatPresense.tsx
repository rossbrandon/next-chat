'use client'

import { useUser } from '@/lib/stores/user'
import { supabaseBrowser } from '@/lib/supabase/browser'
import React, { useEffect, useState } from 'react'

export default function ChatPresense() {
  const { user } = useUser()
  const supabase = supabaseBrowser()
  const [onlineUsers, setOnlineUsers] = useState<number>(0)

  useEffect(() => {
    const channel = supabase.channel('room1')
    channel
      .on('presence', { event: 'sync' }, () => {
        const userIds = new Set<string>()
        for (const id in channel.presenceState()) {
          // @ts-ignore
          const userId = channel.presenceState()[id][0].user_id
          if (userId) {
            userIds.add(userId)
          }
        }
        setOnlineUsers(userIds.size)
        console.log('Online users:', userIds)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) {
    return <div className="h-3 w-1"></div>
  }

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      <h1 className="text-sm text-gray-400">{onlineUsers} online</h1>
    </div>
  )
}
