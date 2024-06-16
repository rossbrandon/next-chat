'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Github } from 'lucide-react'
import ChatPresense from './ChatPresense'
import { FaGoogle } from 'react-icons/fa'

export default function ChatHeader({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const handleLoginWithGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: location.origin + '/auth/callback',
      },
    })
  }

  const handleLoginWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: location.origin + '/auth/callback',
      },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <ChatPresense />
        </div>
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <div className="flex gap-1">
            <Button onClick={handleLoginWithGithub} className="gap-1">
              <Github size={22} />
              Login with Github
            </Button>
            <Button onClick={handleLoginWithGoogle} className="gap-2">
              <FaGoogle size={20} />
              Login with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
