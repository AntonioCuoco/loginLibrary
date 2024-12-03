import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignUp } from '@clerk/clerk-react'
import { Modal, Input, Form, Button } from 'antd'
import Swal from 'sweetalert2'
import { SignInOAuthButtons, SignInOAuthButtonsApple } from '../../utility/utils'

const Signup = () => {

    // const [nameValue, setNameValue] = useState("")
    const [usernameValue, setUsernameValue] = useState("")
    const [emailValue, setEmailValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')
    const { isLoaded, signUp, setActive } = useSignUp()
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const onSignUpPress = async (): Promise<void> => {
        if (!isLoaded) {
            return
        }

        try {
            await signUp.create({
                username: usernameValue,
                emailAddress: emailValue,
                password: passwordValue,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            form.resetFields();

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Registration successful, please check your email for verification code",
            })

            setPendingVerification(true)
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Error" + err.errors[0].message,
            })
        }
    }

    const onPressVerify = async (): Promise<void> => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                navigate('/')
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: JSON.stringify(completeSignUp, null, 2),
                })
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Error" + err.errors[0].message,
            })
        }
    }

    return (
        <div className="h-full w-full flex items-center justify-center">
            {pendingVerification ? (
                <Modal title='Verify Email' footer={null} open={pendingVerification} onClose={() => setPendingVerification(false)} className='flex justify-center items-center w-full h-full' >
                    <Form onFinish={() => onPressVerify()} className='flex flex-col items-start justify-start gap-3'>
                        <Form.Item name='code' rules={[{ required: true, message: 'Please input your verification code!' }, { pattern: /^\d{6}$/, message: 'Deve essere esattamente 6 numeri!', },]}>
                            <Input placeholder='Code' value={code} onChange={(e: any) => setCode(e.target.value)} className="w-full bg-white p-2 rounded mb-2" />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={() => onPressVerify()} className="w-45 bg-[#343A40] rounded text-white" type='primary' htmlType='submit'>Verify Email</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="md:w-fit w-[90%] flex flex-col items-center justify-center gap-8 backdrop-blur-md bg-[#495057] p-8 rounded-lg">
                        <h1 className="md:text-3xl text-[8vw] font-bold text-white text-center">Sign Up To Service</h1>
                        <Form onFinish={() => onSignUpPress()} className='flex flex-col items-start justify-start gap-6'>
                            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please input a valid email!' }]}>
                                <Input placeholder="Email" onChange={(e: any) => setEmailValue(e.target.value)} value={emailValue} className="md:w-72 w-[80vw] p-2 rounded-lg" />
                            </Form.Item>
                            <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                                <Input placeholder="Username" onChange={(e: any) => setUsernameValue(e.target.value)} value={usernameValue} className="md:w-72 w-[80vw] p-2 rounded-lg" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                <Input placeholder="Password" onChange={(e: any) => setPasswordValue(e.target.value)} value={passwordValue} className="md:w-72 w-[80vw] p-2 rounded-lg" type='password' />
                            </Form.Item>
                            <div className='flex flex-col items-center justify-center w-full gap-2'>
                                <div className='flex flex-row items-start justify-center gap-4 w-full'>
                                    <Form.Item className='w-full'>
                                        <Button className="md:w-32 w-[80%] bg-[#343A40] text-white py-5 rounded-lg" htmlType='submit' type='primary'>Signup</Button>
                                    </Form.Item>
                                    <div className='w-full'>
                                        <Button onClick={() => navigate("/")} className="md:w-32 w-[80%] bg-[#343A40] text-white py-5 rounded-lg" type='primary'>Login</Button>
                                    </div>
                                </div>
                                <p className='text-[#DEE2E6] font-bold'>OR</p>
                                <div className='flex flex-row items-center justify-center gap-2 w-full'>
                                    <SignInOAuthButtons color="#ffffff" />
                                    <SignInOAuthButtonsApple color="#ffffff" />
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Signup