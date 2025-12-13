'use client'
import React from 'react'
import { Button } from '../ui/button'
import { authClient } from '@/lib/auth-client'

const Signout = () => {
    return (
        <Button
            onClick={() => {
                authClient.signOut()
            }}
        >Signout</Button>
    )
}

export default Signout