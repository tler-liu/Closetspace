import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = ({}) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        console.log(email, password)

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
                />
            </div>
        </div>
    );
};

export default Login;
