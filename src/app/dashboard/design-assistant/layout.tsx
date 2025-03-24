import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design Assistant - Fanjoy',
  description: 'Create stunning merchandise designs with AI assistance',
}

export default function DesignAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 