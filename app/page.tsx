
import Signout from "@/components/auth/Signout"
import { requireAuth } from "@/lib/auth-utils"

const Home = async () => {

  await requireAuth()
  return (
    <div>
      protected route
      <Signout />
    </div>
  )
}

export default Home