import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import {
    Form,
    FormGroup,
    FormControl,
    FormLabel,
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./ChangeEmail.css";
export default function ChangeEmail() {
    const navigate = useNavigate();
    const [codeSent, setCodeSent] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        code: "",
        email: "",
    });
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    function validateEmailForm() {
        return fields.email.length > 0;
    }
    function validateConfirmForm() {
        return fields.code.length > 0;
    }
    async function handleUpdateClick(event) {
        event.preventDefault();
        setIsSendingCode(true);
        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(user, { email: fields.email });
            setCodeSent(true);
        } catch (error) {
            onError(error);
            setIsSendingCode(false);
        }
    }
    async function handleConfirmClick(event) {
        event.preventDefault();
        setIsConfirming(true);
        try {
            await Auth.verifyCurrentUserAttributeSubmit("email", fields.code);
            navigate("/settings");
        } catch (error) {
            onError(error);
            setIsConfirming(false);
        }
    }
    function renderUpdateForm() {
        return (
            <form onSubmit={handleUpdateClick}>
                <FormGroup bsSize="large" controlId="email">
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isSendingCode}
                    disabled={!validateEmailForm()}
                >
                    Update Email
                </LoaderButton>
            </form>
        );
    }
    function renderConfirmationForm() {
        return (
            <form onSubmit={handleConfirmClick}>
                <FormGroup bsSize="large" controlId="code">
                    <FormLabel>Confirmation Code</FormLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        value={fields.code}
                        onChange={handleFieldChange}
                    />
                    <Form.Text>
                        Please check your email ({fields.email}) for the confirmation code.
                    </Form.Text>
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isConfirming}
                    disabled={!validateConfirmForm()}
                >
                    Confirm
                </LoaderButton>
            </form>
        );
    }
    return (
        <div className="ChangeEmail">
            {!codeSent ? renderUpdateForm() : renderConfirmationForm()}
        </div>
    );
}
