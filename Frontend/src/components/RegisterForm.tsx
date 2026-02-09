import { useState } from "react";
import type { UserInfo } from "../types";

interface RegisterFormProps {
    onError(message: string): void;
    onSucess(userInfo: UserInfo): void;
}

export function RegisterForm({ onError, onSucess }: RegisterFormProps) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validations: { condition: boolean, message: string }[] = [
            { condition: !username, message: "Username is requred!" },
            { condition: password.length < 6, message: "Minimum password length is 6 characters!" }
        ]

        for (const validation of validations) {
            if (validation.condition) {
                onError(validation.message);
                return;
            }
        }
        onSucess({ username, password } as UserInfo)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" onChange={(event) => setUsername(event.target.value.trim())} />
            <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value.trim())} />
            <button type="submit">Submit</button>
        </form>
    )
}