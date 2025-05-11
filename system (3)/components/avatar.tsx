import { Avatar as AvatarPrimitive, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarProps {
  src?: string
  fallback: string
  className?: string
}

export function Avatar({ src, fallback, className }: AvatarProps) {
  return (
    <AvatarPrimitive className={className}>
      <AvatarImage src={src || "/placeholder.svg?height=40&width=40"} alt="Avatar" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </AvatarPrimitive>
  )
}
