import * as actions from "@/actions";

import { Button } from "@nextui-org/react";
import Profile from "@/components/profile";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <form action={actions.signIn}>
        <Button type="submit">Sign in</Button>
      </form>

      <form action={actions.signOut}>
        <Button type="submit">Sign out</Button>
      </form>

      {session?.user ? (
        <div>Signed In: {JSON.stringify(session.user)}</div>
      ) : (
        <div>Signed Out</div>
      )}

      <Profile />
    </div>
  );
}
