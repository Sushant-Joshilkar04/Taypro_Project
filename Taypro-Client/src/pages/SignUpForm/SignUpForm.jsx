import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { IconBrandGoogle } from "@tabler/icons-react";
import BottomGradient from '../../components/BottomGradient';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import ReactLoading from 'react-loading';

export function SignupForm() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = (username, email, password, confirmPassword) => {
        if (!username || !email || !password || !confirmPassword) {
            return "All fields are required";
        }
        if (password !== confirmPassword) {
            return "Passwords do not match";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Invalid email address";
        }
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return "valid";
    };

    const postData = async () => {
        await axiosInstance.post('/auth/signup', {
            username,
            email,
            password
        }).then((res) => {
            toast.success("OTP has been sent to your email", {
                className: 'text-l'
            });
            navigate('/verifyOTP', { state: { email } });
        }).catch((err) => {
            toast.error(err.response.data.msg, {
                className: 'text-l'
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const errorMessage = validateForm(username, email, password, confirmPassword);
        if (errorMessage !== "valid") {
            toast.error(errorMessage, {
                className: 'text-l '
            });
            setLoading(false);
            return;
        }
        postData();
    }

    return (
        <>
            <div className="min-h-screen py-10">
                <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                        Welcome to TayPro
                    </h2>
                    <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                        Sign up to empowering renewable energy
                    </p>

                    <form className="mt-8" onSubmit={handleSubmit}>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="John123"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </LabelInputContainer>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                placeholder="projectmayhem@fc.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </LabelInputContainer>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </LabelInputContainer>
                        <LabelInputContainer className="mb-8">
                            <Label htmlFor="confirmpassword">Confirm password</Label>
                            <Input
                                id="confirmpassword"
                                placeholder="••••••••"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </LabelInputContainer>

                        <button
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            type="submit"
                        >
                            {loading ?
                                <div className="w-full px-5 flex items-center justify-center h-4 ">
                                    <ReactLoading type={"balls"} className="w-12 fill-white dark:fill-black" />
                                </div>
                                :
                                <div>
                                    Sign up &rarr;
                                    <BottomGradient />
                                </div>
                            }
                        </button>

                        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                        <div className="text-gray-600 mt-8">
                            Already have an account?&nbsp;
                            <div className="inline hover:underline hover:cursor-pointer hover:text-blue-500 dark:hover:text-white" onClick={() => navigate('/login')}>
                                Log In
                            </div>.
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
}


// LabelInputContainer component
const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export default SignupForm;
