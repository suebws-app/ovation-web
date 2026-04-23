import { SignUpHeader } from './SignUpHeader'

export const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SignUpHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
