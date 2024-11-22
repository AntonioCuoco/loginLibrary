import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignUp } from '@clerk/clerk-react'
import { Modal, Input, Form, Button } from 'antd'

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

    const onSignUpPress = async () => {
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

            alert("Registration successful, please check your email for verification code")

            setPendingVerification(true)
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            alert("Error" + err.errors[0].message);
        }
    }

    const onPressVerify = async () => {
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
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            alert("Error" + err.errors[0].message);
        }
    }

    return (
        <div className="h-full w-full flex items-center justify-center">
            {pendingVerification ? (
                <Modal title='Verify Email' footer={null} open={pendingVerification} onClose={() => setPendingVerification(false)} className='flex justify-center items-center w-full h-full' >
                    <Form onFinish={() => onPressVerify()} className='flex flex-col items-start justify-start gap-3'>
                        <Form.Item name='code' rules={[{ required: true, message: 'Please input your verification code!' },{pattern: /^\d{6}$/,message: 'Deve essere esattamente 6 numeri!',},]}>
                            <Input placeholder='Code' value={code} onChange={(e: any) => setCode(e.target.value)} className="w-full bg-white p-2 rounded mb-2" />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={() => onPressVerify()} className="w-45 bg-[#343A40] rounded text-white" type='primary' htmlType='submit'>Verify Email</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-fit flex flex-col items-center justify-center gap-8 backdrop-blur-md bg-[#495057] p-8 rounded-lg">
                        <h1 className="text-3xl font-bold text-white mb-8 text-center">Sign Up To Service</h1>
                        <Form onFinish={() => onSignUpPress()}>
                            <Form.Item label={<span className="text-[#DEE2E6]">Email</span>} name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please input a valid email!' }]}>
                                <Input placeholder="Email" onChange={(e: any) => setEmailValue(e.target.value)} value={emailValue} className="w-72 p-2 rounded-lg" />
                            </Form.Item>
                            <Form.Item label={<span className="text-[#DEE2E6]">Username</span>} name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                                <Input placeholder="Username" onChange={(e: any) => setUsernameValue(e.target.value)} value={usernameValue} className="w-72 p-2 rounded-lg" />
                            </Form.Item>
                            <Form.Item label={<span className="text-[#DEE2E6]">Password</span>} name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                <Input placeholder="Password" onChange={(e: any) => setPasswordValue(e.target.value)} value={passwordValue} className="w-72 p-2 rounded-lg" type='password' />
                            </Form.Item>
                            <div className='flex flex-row items-start justify-center gap-4'>
                                <Form.Item>
                                    <Button className="w-32 bg-[#343A40] text-white py-5 rounded-lg" htmlType='submit'>Signup</Button>
                                </Form.Item>
                                <Button onClick={() => navigate("/")} className="w-32 bg-[#343A40] text-white py-5 rounded-lg">Login</Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    )
}

{/* <div className="w-fit flex flex-row items-center justify-center gap-2">
                            <label className="text-[#DEE2E6] text-lg mb-2 text-left">Email:</label>
                            <Input placeholder="Email" onChange={(e: any) => setEmailValue(e.target.value)} value={emailValue} className="w-72 p-2 rounded-lg" />
                        </div>
                        <div className="w-fit flex flex-row items-center justify-center gap-2">
                            <label className="text-[#DEE2E6] text-lg mb-2 text-left">Username:</label>
                            <Input placeholder="Username" onChange={(e: any) => setUsernameValue(e.target.value)} value={usernameValue} className="w-64 p-2 rounded-lg" />
                        </div>
                        <div className="w-fit flex flex-row items-center justify-center gap-2">
                            <label className="text-[#DEE2E6] text-lg mb-2 text-left">Password:</label>
                            <Input placeholder="Password" onChange={(e: any) => setPasswordValue(e.target.value)} value={passwordValue} className="w-64 p-2 rounded-lg" type='password'/>
                        </div>
                        <div className="w-fit flex flex-row items-center justify-center gap-4">
                            <button onClick={() => onSignUpPress()} className="w-32 bg-[#343A40] text-white py-3 rounded-lg">Signup</button>
                            <button onClick={() => navigate("/")} className="w-32 bg-[#343A40] text-white py-3 rounded-lg">Login</button>
                        </div> */}

export default Signup