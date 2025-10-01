import { useSession } from "next-auth/react"

export default function HelloMsg() {
    const { data: session } = useSession()
    const centerText = session ? `Hello, ${session.user?.name}!` : null

    if (!centerText) {
        return null
    }

    return (
        <div className="border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm text-gray-700">
                {centerText}
            </div>
        </div>
    )
}
