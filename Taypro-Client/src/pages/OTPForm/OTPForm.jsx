//OTPForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import BottomGradient from "../../components/BottomGradient";
import ReactLoading from 'react-loading';

const OTPForm = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { email, passwordResetFlag } = location.state || {};

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(30); // Countdown time in seconds

    useEffect(() => {
        let interval;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [countdown]);

    const checkOtp = async () => {
        setLoading(true);
        setResendDisabled(true);
        if (otp === "") {
            toast.error("Please Enter OTP", {
                className: 'text-black'
            });
            setLoading(false);
            return;
        }
        const otpNumber = parseInt(otp);
        await axiosInstance.post('/auth/email-verification', {
            email,
            otp: otpNumber,
            passwordResetFlag
        }).then((res) => {
            toast.success(res.data.msg, {
                className: 'text-l'
            });
            if (res.data.passwordResetFlag) {
                toast.success('Reset your password', {
                    className: 'text-l'
                });
                navigate('/resetPassword', { state: { email } });
            }
            else {
                toast.success('Log in with registered email', {
                    className: 'text-l'
                });
                navigate('/login');
            }
            return;
        }).catch((err) => {
            toast.error('OTP does not matched', {
                className: 'text-l'
            });
            setOtp('');
            // console.log(err.response);
            return;
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await axiosInstance.post('/auth/send-otp', { email });
            toast.success('OTP resent successfully', {
                className: 'text-l'
            });
            setCountdown(30);  // Reset the countdown timer
            setResendDisabled(true);
        } catch (error) {
            toast.error('Failed to resend OTP. \nPlease try again later.', {
                className: 'text-l'
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen w-full flex flex-col items-center shadow-input">
            <div className=" max-w-md m-12  bg-slate-300 dark:bg-black  text-neutral-800 dark:text-neutral-200 rounded-xl">
                <div className="relative p-6 border rounded-xl border-black flex flex-col justify-center items-center">
                    <h3 className="font-bold text-lg">Hello !</h3>
                    <p className="py-4">Please enter OTP sent on your email : <span className="font-bold">'{email}'</span> </p>
                    <input type="text" className="w-full border-2 text-black border-gray-300 p-2 rounded mb-4" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                    {loading ?
                        <div className="w-full px-5 flex items-center justify-center h-4 ">
                            <ReactLoading type={"balls"} className="w-12 fill-white dark:fill-black" />
                        </div>
                        :
                        <div className="flex flex-col w-full">
                            <button
                                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-md h-10 px-8 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            >
                                <div onClick={checkOtp}>
                                    Verify &rarr;
                                    <BottomGradient />
                                </div>
                            </button>
                            <div className="font-thin text-sm">
                                {resendDisabled ?
                                    <span  >If the email is not received please check the mail or resend OTP in <b className="font-bold inline">{countdown} s</b></span> :
                                    <button onClick={handleResendOtp} className="hover:font-bold">Resend OTP</button>
                                }
                            </div>
                        </div>
                    }

                    <div className="mt-4 font-thin text-sm ">
                        sign up with another email
                        <div onClick={() => navigate('/signup')} className="inline cursor-pointer text-blue-950 dark:text-blue-300 hover:underline"> Sign Up</div>
                    </div>
                    <div className=" absolute top-0 right-0 p-4" >
                        <button className="btn text-2xl" onClick={() => navigate('/signup')}>❎</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OTPForm