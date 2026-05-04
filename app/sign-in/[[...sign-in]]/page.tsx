import { SignIn } from "@clerk/nextjs";
import { TerminalFrame } from "@/components/terminal-frame";

export default function SignInPage() {
  return (
    <TerminalFrame title="~/sign-in">
      <div className="flex justify-center py-6">
        <SignIn forceRedirectUrl="/admin" />
      </div>
    </TerminalFrame>
  );
}
