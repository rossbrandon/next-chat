'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useMessage } from '@/lib/stores/messages'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { toast } from 'sonner'

export function DeleteAlert() {
  const actionMessage = useMessage((state) => state.actionMessage)
  const optimisticDeleteMessage = useMessage(
    (state) => state.optimisticDeleteMessage
  )

  const handleDelete = async () => {
    const supabase = supabaseBrowser()

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', actionMessage?.id!)
    if (error) {
      toast.error(error.message)
    } else {
      optimisticDeleteMessage(actionMessage?.id!)
      toast.success('Message deleted')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Message?</AlertDialogTitle>
          <AlertDialogDescription className="line-clamp-2">
            {actionMessage?.text}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
