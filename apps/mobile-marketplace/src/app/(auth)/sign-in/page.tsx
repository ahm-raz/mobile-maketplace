import SignInShell from "./shell";

import { redirectIfAlreadyAuthenticated } from "@/lib/auth/redirect-if-authenticated";

export default async function SignInPage() {
	await redirectIfAlreadyAuthenticated();
	return <SignInShell />;
}
