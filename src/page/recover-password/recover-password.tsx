import React, { useState } from 'react'
import { useAuth, useSignIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input } from 'antd'
import Swal from 'sweetalert2'

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [successfulCreation, setSuccessfulCreation] = useState(false)

    const navigate = useNavigate();
    const { isSignedIn } = useAuth()
    const { isLoaded, signIn, setActive } = useSignIn()

    if (!isLoaded) {
        return null
    }

    // If the user is already signed in,
    // redirect them to the home page
    if (isSignedIn) {
        navigate('/');
    }

    // Send the password reset code to the user's email
    const create = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            await signIn
                ?.create({
                    strategy: 'reset_password_email_code',
                    identifier: email,
                })
            setSuccessfulCreation(true)
        } catch (err: any) {
            console.error('error', err.errors[0].longMessage)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.errors[0].longMessage,
            })
        }
    }

    // Reset the user's password.
    // Upon successful reset, the user will be
    // signed in and redirected to the home page
    const reset = async (e: React.FormEvent) => {
        e.preventDefault()
        await signIn
            ?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })
            .then((result) => {
                // Check if 2FA is required
                if (result.status === 'complete') {
                    // Set the active session to
                    // the newly created session (user is now signed in)
                    setActive({ session: result.createdSessionId })
                } else {
                    console.log(result)
                }
            })
            .catch((err) => {
                console.error('error', err.errors[0].longMessage)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.errors[0].longMessage,
                })
            })
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="md:w-fit w-[90%] flex flex-col items-center justify-center gap-8 backdrop-blur-md bg-[#495057] p-8 rounded-lg">
                {!successfulCreation && (
                    <>
                        <h1 className="text-[#DEE2E6] md:text-2xl text-[8vw] font-bold text-center">Forgot Password?</h1>
                        <Form onFinish={!successfulCreation ? create : reset} className='flex flex-col items-start justify-start gap-6'>
                            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                                <Input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="md:w-80 w-[80vw] p-2 rounded-lg" placeholder='Email' />
                            </Form.Item>
                            <div className='flex md:flex-row md:items-start md:justify-center flex-col gap-4 w-full'>
                                <Form.Item className='w-full'>
                                    <Button className="md:w-44 w-[80%] bg-[#343A40] text-white py-5 rounded-lg" type="primary" htmlType="submit">Send password reset code</Button>
                                </Form.Item>
                                <div className='w-full flex items-center justify-center'>
                                    <Button onClick={() => navigate("/")} className="md:w-32 w-[80%] bg-[#343A40] text-white py-5 rounded-lg" type="primary">Go To Login</Button>
                                </div>
                            </div>
                        </Form>
                    </>
                )}
                {successfulCreation && (
                    <>
                        <h1 className="text-[#DEE2E6] text-2xl font-bold">Forgot Password?</h1>
                        <Form onFinish={!successfulCreation ? create : reset} className='flex flex-col items-start justify-start gap-6'>
                            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="w-72 p-2 rounded-lg" placeholder='Password' />
                            </Form.Item>
                            <Form.Item name="code" rules={[{ required: true, message: 'Please input your code!' }]}>
                                <Input type="text" onChange={(e) => setCode(e.target.value)} value={code} className="w-72 p-2 rounded-lg" placeholder='Code' />
                            </Form.Item>
                            <div className='flex flex-row items-start justify-center gap-4 w-full'>
                                <Form.Item>
                                    <Button className="w-32 bg-[#343A40] text-white py-5 rounded-lg" type="primary" htmlType="submit">Reset Password</Button>
                                </Form.Item>
                                <Button onClick={() => navigate("/login")} className="w-32 bg-[#343A40] text-white py-5 rounded-lg" type="primary">Go To Login</Button>
                            </div>
                        </Form>
                    </>
                )}
            </div>
        </div>

        // <div
        //     className='flex flex-col items-center justify-center w-full h-full'
        // >
        //     <h1>Forgot Password?</h1>
        //     <Form
        //         onFinish={!successfulCreation ? create : reset}
        //     >
        //         {!successfulCreation && (
        //             <div>
        //                 <Input
        //                     type="email"
        //                     placeholder="e.g john@doe.com"
        //                     value={email}
        //                     onChange={(e) => setEmail(e.target.value)}
        //                 />
        //                 <Button>Send password reset code</Button>
        //                 {error && <p>{error}</p>}
        //             </div>
        //         )}

        //         {successfulCreation && (
        //             <div>
        //                 <Input
        //                     type="password"
        //                     value={password}
        //                     onChange={(e) => setPassword(e.target.value)}
        //                 />
        //                 <Input
        //                     type="text"
        //                     value={code}
        //                     onChange={(e) => setCode(e.target.value)}
        //                 />
        //                 <Button>Reset</Button>
        //             </div>
        //         )}

        //         {secondFactor && <p>2FA is required, but this UI does not handle that</p>}
        //     </Form>
        // </div>
    )
}

export default ForgotPasswordPage