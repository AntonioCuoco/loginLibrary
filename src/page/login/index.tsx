import { useState } from 'react';
import { useSignIn,useSession } from '@clerk/clerk-react'; // Assicurati di usare clerk-react per il web
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form } from 'antd';
import Swal from 'sweetalert2';
import { SignInOAuthButtons, SignInOAuthButtonsApple } from '../../utility/utils';

const Login = () => {
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const { signIn, setActive, isLoaded } = useSignIn();
    const navigate = useNavigate();

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailValue,
                password: passwordValue,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                navigate('/');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: JSON.stringify(signInAttempt, null, 2),
                })
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.errors[0].message,
            })
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="md:w-fit w-[90%] flex flex-col items-center justify-center gap-8 backdrop-blur-md bg-[#495057] p-6 md:p-8 rounded-lg">
                <h1 className="text-[#DEE2E6] md:text-3xl text-[8vw] font-bold text-center">Login To Service</h1>
                <Form onFinish={() => onSignInPress()} className='flex flex-col items-start justify-start gap-6'>
                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please input a valid email!' }]}>
                        <Input type="email" onChange={(e) => setEmailValue(e.target.value)} value={emailValue} className="md:w-72 w-[80vw] p-2 rounded-lg" placeholder='Email' />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input type="password" onChange={(e) => setPasswordValue(e.target.value)} value={passwordValue} className="md:w-72 w-[80vw] p-2 rounded-lg" placeholder='Password' />
                    </Form.Item>
                    <div className='flex flex-row items-start justify-center gap-8 w-full'>
                        <Form.Item className='w-full'>
                            <Button className="md:w-32 w-[80%] bg-[#343A40] text-white py-5 rounded-lg" type="primary" htmlType="submit">Login</Button>
                        </Form.Item>
                        <div className='w-full'> 
                            <Button onClick={() => navigate("/signup")} className="md:w-32 w-[80%] bg-[#343A40] text-white py-5 rounded-lg" type="primary">Signup</Button>
                        </div>
                    </div>
                </Form>
                <div className='flex flex-col items-center justify-center w-full gap-2'>
                    <div className='flex flex-row items-center justify-center gap-2 w-full'>
                        <SignInOAuthButtons color="#ffffff" />
                        <SignInOAuthButtonsApple color="#ffffff" />
                    </div>
                    <p className='text-[#DEE2E6] font-bold'>OR</p>
                    <p onClick={() => navigate("/forget-password")} className="w-32 text-white cursor-pointer">Recover Password</p>
                </div>
            </div>
        </div>
    );
};

export default Login