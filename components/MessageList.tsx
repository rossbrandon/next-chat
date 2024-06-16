'use client'

import { Message, useMessage } from '@/lib/stores/messages'
import React, { useEffect, useRef, useState } from 'react'
import ChatMessage from './ChatMessage'
import { DeleteAlert } from './DeleteAlert'
import { EditAlert } from './EditAlert'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { toast } from 'sonner'
import { ArrowDown } from 'lucide-react'
import LoadMoreMessages from './LoadMoreMessages'

export default function MessageList() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const [hasScrolled, setHasScrolled] = useState<boolean>(false)
  const [notificationCount, setNotificationCount] = useState<number>(0)
  const {
    messages,
    optimisticIds,
    addMessage,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage()
  const supabase = supabaseBrowser()

  // Subscribe to realtime changes from Supabase
  useEffect(() => {
    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from('users')
              .select('*')
              .eq('id', payload.new.sent_by)
              .single()

            if (error) {
              toast.error(error.message)
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              }
              addMessage(newMessage as Message)
            }
          }
          const scrollContainer = scrollRef.current
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotificationCount((current) => current + 1)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          optimisticUpdateMessage(payload.new as Message)
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => {
          optimisticDeleteMessage(payload.old.id)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
    // eslint-disable-next-line
  }, [messages])

  // Scroll to new message when it is received
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (scrollContainer && !hasScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
    // eslint-disable-next-line
  }, [messages])

  const handleScroll = () => {
    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
      setHasScrolled(isScroll)
      // Set notification count to 0 if user has scrolled to the bottom
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotificationCount(0)
      }
    }
  }

  const scrollToBottom = () => {
    setNotificationCount(0)
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }

  const pluralize = (message: string, count: number): string => {
    return count > 1 ? `${message}s` : message
  }

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="flex-1 pb-5">
          <LoadMoreMessages />
        </div>
        <div className="space-y-7">
          {messages.map((message, index) => {
            return <ChatMessage key={index} message={message} />
          })}
        </div>
        <EditAlert />
        <DeleteAlert />
      </div>
      {hasScrolled && (
        <div className="absolute bottom-40 w-full">
          {notificationCount ? (
            <div
              className="w-40 text-center mx-auto bg-primary p-1 rounded-md cursor-pointer hover:scale-110 transition-all"
              onClick={scrollToBottom}
            >
              <h1>
                {pluralize(
                  `${notificationCount} new message`,
                  notificationCount
                )}
              </h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-primary rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
              onClick={scrollToBottom}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  )
}
