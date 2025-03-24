import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-2 p-4">
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <PaperAirplaneIcon className="h-4 w-4" />
      </motion.button>
    </form>
  )
} 