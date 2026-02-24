import type { FormEvent, ReactNode } from "react";
import "./Styles/Auth.css";

type GenericFormProps = {
    title: string;
    submitLabel: string;
    isSubmitting?: boolean;
    error?: string | null;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
};

export function GenericForm({ title, submitLabel, isSubmitting = false, error, onSubmit, children }: GenericFormProps) {
    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '20px auto' }}>
            <form onSubmit={onSubmit} className="auth-container">
                <h3 className="auth-title" style={{ fontSize: "1.25rem", margin: "0 0 16px" }}>
                    {title}
                </h3>
                <div className="auth-input-group">
                    {children}
                    <button type="submit" className="auth-button" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : submitLabel}
                    </button>
                </div>
            </form>
            <p className={`auth-error-message ${error ? 'visible' : ''}`}>{error}</p>
        </div>
    );
}
