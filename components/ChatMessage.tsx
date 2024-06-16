import { Message } from '@/lib/stores/messages'
import Image from 'next/image'
import React from 'react'
import MessageMenu from './MessageMenu'
import { useUser } from '@/lib/stores/user'

export default function ChatMessage({ message }: { message: Message }) {
  const user = useUser((state) => state.user)

  return (
    <div className="flex gap-2">
      <div>
        <Image
          src={message.users?.avatar_url!}
          alt={message.users?.display_name!}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="font-bold">{message.users?.display_name}</h1>
            <h1 className="text-sm text-gray-400">
              {new Date(message.created_at).toDateString()}
            </h1>
            {message.edited && (
              <h1 className="text-sm italic text-gray-400">edited</h1>
            )}
          </div>
          {message.users?.id === user?.id && <MessageMenu message={message} />}
        </div>
        <p className="text-gray-300 whitespace-pre-line">{message.text}</p>
      </div>
    </div>
  )
}
