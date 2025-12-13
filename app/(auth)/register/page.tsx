import RegisterForm from '@/components/auth/registerForm'
import { requireUnauth } from '@/lib/auth-utils';
import React from 'react'

const page = async () => {
    await requireUnauth();
    return (
        <div>
            <RegisterForm />
        </div>
    )
}

export default page