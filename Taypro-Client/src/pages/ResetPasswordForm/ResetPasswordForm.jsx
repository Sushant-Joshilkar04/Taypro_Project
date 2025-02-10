import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import BottomGradient from "../../components/BottomGradient";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import ReactLoading from 'react-loading';

const ResetPasswordForm = () => {

    const navigate = useNavigate()
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const location = useLocation();
    const { email } = location.state || {};

    const validateForm = (password, confirmPassword) => {
        if (!password || !confirmPassword) {
            return "All fields are required";
        }
        if (password !== confirmPassword) {
            return "Password do not match";
        }
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return "valid";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const errorMessage = validateForm(password, confirmPassword);
        if (errorMessage !== "valid") {
            toast.error(errorMessage, {
                className: 'text-l '
            });
            setLoading(false);
            return;
        }
        await axiosInstance.post('/auth/reset-password', {
            email,
            password
        }).then((res) => {
            // console.log(res.data);
            toast.success(res.data.msg, {
                className: ' text-l'
            });
            toast.info('Login again to verify', {
                className: ' text-l'
            });
            navigate('/login');
        }).catch((err) => {
            toast.error(err.response.data.msg, {
                className: ' text-l'
            });
            // console.log(err.response);
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <div className="min-h-screen flex items-center decoration-sky-300">
            <div className="h-fit max-w-md w-full mx-auto rounded-none m-5 md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Welcome to World
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Reset or generate your password
                </p>

                <form className="mt-8" onSubmit={handleSubmit}>
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
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Confirm Password</Label>
                        <Input
                            id="confirm_password"
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
                                Reset Password &rarr;
                                <BottomGradient />
                            </div>
                        }
                    </button>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                    <div className="text-gray-600 mt-8 ">
                        Don't want to change the password?&nbsp;
                        <div className="inline hover:underline hover:cursor-pointer hover:text-blue-500 dark:hover:text-white" onClick={() => navigate('/login')}>
                            Login
                        </div>.
                    </div>
                </form>
            </div>
        </div>

    )
}

export default ResetPasswordForm;

// LabelInputContainer component
const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};