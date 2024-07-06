'use client';
import React from 'react';
import { useSession , signIn , signOut } from 'next-auth/react';

const SignIn = () => {
    const {data : session} = useSession();

    if(session) {
        return (
            <>
             <div>Signed In as {session.user.email}</div>
             <button className='bg-red-500 px-4 py-2 rounded-md text-white' onClick={() => signOut()}>SignOut</button>
            </>
        )
    }
  return (
     <>
      <h1>Not signed In</h1>
      <button className='bg-green-600 px-4 py-2 rounded-md text-white' onClick={() => signIn()}>SignIn</button>
     </>
  )
}

export default SignIn
