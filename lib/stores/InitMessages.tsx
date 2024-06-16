'use client'

import React, { useEffect, useRef } from 'react'
import { Message, useMessage } from './messages'
import { MESSAGE_PAGE_SIZE } from '../constants'

export default function InitMessages({ messages }: { messages: Message[] }) {
  const initState = useRef(false)
  const hasMorePages = messages.length >= MESSAGE_PAGE_SIZE

  useEffect(() => {
    if (!initState.current) {
      useMessage.setState({ messages, hasMorePages })
    }
    initState.current = true
    // eslint-disable-next-line
  }, [])

  return <></>
}
