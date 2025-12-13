import LoginForm from '@/components/auth/loginForm'
import { requireUnauth } from '@/lib/auth-utils';

const page = async () => {

    await requireUnauth();

    return (
        <div>
            <LoginForm />
        </div>
    )

}

export default page