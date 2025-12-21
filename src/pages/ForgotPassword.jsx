import React, { useState } from 'react';
import './ForgotPassword.css';
import EmailStep from './EmailStep';
import CodeStep from './CodeStep';
import PasswordStep from './PasswordStep';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                {step === 1 && (
                    <EmailStep
                        onNext={(emailValue) => {
                            setEmail(emailValue);
                            setStep(2);
                        }}
                    />
                )}

                {step === 2 && (
                    <CodeStep
                        email={email}
                        onNext={(codeValue) => {
                            setCode(codeValue);
                            setStep(3);
                        }}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <PasswordStep
                        email={email}
                        code={code}
                        onBack={() => setStep(2)}
                    />
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;