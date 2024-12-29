import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = ({}) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup, login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleError = (err) => {
        let msg = "";
        switch (err) {
            case "auth/invalid-email":
                msg = isLogin
                    ? "User with email does not exist"
                    : "Not a valid email";
                break;
            case "auth/invalid-credential":
                msg = "These credentials don't match any user";
                break;
            case "auth/weak-password":
                msg = "Please enter a stronger password";
                break;
        }
    };

    const handleSubmit = async () => {
        if (!email || !password) {
            return;
        }

        if (isLogin) {
            try {
                setLoading(true);
                await login(email, password);
                navigate("/");
            } catch (error) {
                console.log(error.code);
            }
        } else {
            // is SignUp
            try {
                setLoading(true);
                await signup(email, password);
                navigate("/");
            } catch (error) {
                console.log(error.code);
            }
        }

        setLoading(false);
        setEmail("");
        setPassword("");
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h3>{isLogin ? "Login" : "Sign Up"}</h3>
                <Input
                    value={email}
                    placeholder="Email"
                    autoFocus={true}
                    onInputFn={handleEmailChange}
                />
                <Input
                    value={password}
                    placeholder="Password"
                    autoFocus={false}
                    type="password"
                    onInputFn={handlePasswordChange}
                />
                <div
                    className="mode-switcher"
                    onClick={() => {
                        setIsLogin(!isLogin);
                    }}
                >
                    {isLogin
                        ? "New user? Click here to create account"
                        : "Existing user? Click here to log in"}
                </div>
                <Button
                    label={isLogin ? "Login" : "Sign Up"}
                    variant="create"
                    size="medium"
                    onClickFn={handleSubmit}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default Login;
