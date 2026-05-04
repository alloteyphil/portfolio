import { SignIn } from "@clerk/nextjs";
import { TerminalFrame } from "@/components/terminal-frame";

export default function SignInPage() {
  return (
    <TerminalFrame title="~/sign-in">
      <div className="flex justify-center py-4 sm:py-6">
        <div className="w-full min-w-0 max-w-md overflow-x-auto px-0 sm:px-1">
          <SignIn forceRedirectUrl="/admin" />
        </div>
      </div>
    </TerminalFrame>
  );
}
