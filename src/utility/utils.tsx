import { useSignIn } from "@clerk/clerk-react"
import { AppleOutlined, GoogleOutlined } from "@ant-design/icons"

const SignInOAuthButtons = ({ color }: { color: string }): JSX.Element => {
  const { signIn, isLoaded } = useSignIn()

  const signInWithGoogle = () => {
    signIn?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    })
  }

  return <GoogleOutlined onClick={() => signInWithGoogle()} style={{ color: color, border: "1px solid #ffffff", borderRadius: "50%", padding: "5%" }} />
}

const SignInOAuthButtonsApple = ({ color }: { color: string }): JSX.Element => {
  const { signIn, isLoaded } = useSignIn()

  const signInWithApple = () => {
    signIn?.authenticateWithRedirect({
      strategy: 'oauth_apple',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    })
  }

  return <AppleOutlined onClick={() => signInWithApple()} style={{ color: color, border: "1px solid #ffffff", borderRadius: "50%", padding: "5%" }} />
}

export { SignInOAuthButtons, SignInOAuthButtonsApple }