import React from 'react'

export default function ChatAbout() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-5">
        <h1 className="text-3xl font-bold">Welcome to Daily Chat</h1>
        <p className="w-96">
          This is an example chat application powered by NextJS and Supabase
          Realtime DB
        </p>
      </div>
    </div>
  )
}
