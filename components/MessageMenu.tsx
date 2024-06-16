'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Message, useMessage } from '@/lib/stores/messages'

export default function MessageMenu({ message }: { message: Message }) {
  const setActionMessage = useMessage((state) => state.setActionMessage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:bg-gray-800 cursor-pointer"
          onClick={() => {
            document.getElementById('trigger-edit')?.click()
            setActionMessage(message)
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 hover:bg-gray-800 cursor-pointer"
          onClick={() => {
            document.getElementById('trigger-delete')?.click()
            setActionMessage(message)
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
