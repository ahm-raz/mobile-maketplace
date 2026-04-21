import SignUpShell from "./shell";

import { redirectIfAlreadyAuthenticated } from "@/lib/auth/redirect-if-authenticated";

export default async function SignUpPage() {
	await redirectIfAlreadyAuthenticated();
	return <SignUpShell />;
}
