import React,{ useContext, useState} from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';

function Signup() {
    const [profilePic, setprofilePic] = useState(null);
    const [fullName, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [adminInviteToken, setadminInviteToken] = useState("");

    const {updateUser} = useContext(UserContext)
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    // Password validation regex: 
    // - min 8 chars, at least one uppercase, one lowercase, one number, one special char
    const validatePassword = (pwd) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pwd);
    }

    // Handle SignUp Form Submit
    const handleSignUp = async (e) => {
        e.preventDefault();
        
        let profileImageUrl = '';

        if(!fullName){
            setError("Please enter full name");
            return;
        }

        if(!validateEmail(email)){
            setError("Please enter a valid email address");
            return;
        }

        if(!profilePic){
            setError("Please select a profile picture");
            return;
        }

        if(!password) {
            setError("Please enter the password");
            return;
        }

        if(!validatePassword(password)){
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
            return;
        }

        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        setError("");

        // SignUp API Call
        try {
            // Upload image if present
            if(profilePic){
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name: fullName,
                email,
                password,
                adminInviteToken,
                profileImageUrl,
            });

            const { token , role } = response.data;

            if(token){
                localStorage.setItem("token",token);
                updateUser(response.data);

                // Redirect based on role
                if(role === "admin"){
                    navigate("/admin/dashboard");
                }else{
                    navigate("/user/dashboard");
                }
            }
            
        } catch (error) {
            console.log("Error during signup:", error); 
            console.log("Error response:", error.response); 
            if(error.response && error.response.data.message ){
                setError(error.response.data.message)
            }else{
                setError(" Something went wrong. Please try again");
            }
        }
    }

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className='text-xl font-semibold text-black'> Create an Account</h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>
                    Join us today by entering your details below
                </p>

                <form onSubmit={handleSignUp}>
                    <ProfilePhotoSelector image={profilePic} setImage={setprofilePic} />

                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            value={fullName}
                            onChange={({target}) => setfullName(target.value)}
                            label="Full Name"
                            placeholder="John"
                            type="text"
                        />

                        <Input 
                            value={email}
                            onChange={({target}) => setEmail(target.value)}
                            label="Email Address"
                            placeholder="John@example.com"
                            type="text"
                        />

                        <Input 
                            value={password}
                            onChange={({target}) => setPassword(target.value)}
                            label="Password"
                            placeholder="Min 8 characters, include uppercase, number & special char"
                            type="password"
                        />

                        <Input 
                            value={confirmPassword}
                            onChange={({target}) => setConfirmPassword(target.value)}
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            type="password"
                        />

                        <Input 
                            value={adminInviteToken}
                            onChange={({target}) => setadminInviteToken(target.value)}
                            label="Admin Invite Token"
                            placeholder="6 Digit Code"
                            type="text"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button type="submit" className="btn-primary">
                        SIGN UP
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Already have an account?{" "}
                        <Link className="font-medium text-primary underline" to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Signup
