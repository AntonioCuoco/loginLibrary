import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react'; // Assicurati di usare clerk-react per il web
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form } from 'antd';

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
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            alert("Error" + err.errors[0].message);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-fit flex flex-col items-center justify-center gap-8 backdrop-blur-md bg-[#495057] p-8 rounded-lg">
                <h1 className="text-[#DEE2E6] text-3xl font-bold">Login To Service</h1>
                <Form onFinish={() => onSignInPress()}>
                    <Form.Item label={<span className="text-[#DEE2E6]">Email</span>} name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input type="email" onChange={(e) => setEmailValue(e.target.value)} value={emailValue} className="w-64 p-2 rounded-lg" />
                    </Form.Item>
                    <Form.Item label={<span className="text-[#DEE2E6]">Password</span>} name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input type="password" onChange={(e) => setPasswordValue(e.target.value)} value={passwordValue} className="w-64 p-2 rounded-lg" />
                    </Form.Item>
                    <div className='flex flex-row items-start justify-center gap-4'>
                        <Form.Item>
                            <Button className="w-32 bg-[#343A40] text-white py-5 rounded-lg" type="primary" htmlType="submit">Login</Button>
                        </Form.Item>
                        <Button onClick={() => navigate("/signup")} className="w-32 bg-[#343A40] text-white py-5 rounded-lg" type="primary">Signup</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};


{/* <div className="w-fit flex flex-row items-center justify-center gap-2">
                    <label className="text-[#DEE2E6] text-lg mb-2 text-left">Email:</label>
                    <Input type="email" onChange={(e) => setEmailValue(e.target.value)} value={emailValue} className="w-64 p-2 rounded-lg" />
                </div>
                <div className="w-fit flex flex-row items-center justify-center gap-2">
                    <label className="text-[#DEE2E6] text-lg mb-2 text-left">Password:</label>
                    <Input type="password" onChange={(e) => setPasswordValue(e.target.value)} value={passwordValue} className="w-64 p-2 rounded-lg" />
                </div>
                <div className="w-fit flex flex-row items-center justify-center gap-4">
                    <Button onClick={onSignInPress} className="w-32 bg-[#343A40] text-white py-3 rounded-lg">Login</Button>
                    <Button onClick={() => navigate("/signup")} className="w-32 bg-[#343A40] text-white py-3 rounded-lg">Signup</Button>
                </div> */}

export default Login