"use client";

import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();

  return (
    <div>
      {session.data?.user ? (
        <div>
          from client: user is Signed In: {JSON.stringify(session.data?.user)}
        </div>
      ) : (
        <div>from client: user is Signed Out</div>
      )}
    </div>
  );
}
