import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./ChangePassword.css";
export default function ChangePassword() {
    const navigate = useNavigate();
    const [fields, handleFieldChange] = useFormFields({
        password: "",
        oldPassword: "",
        confirmPassword: "",
    });
    const [isChanging, setIsChanging] = useState(false);
    function validateForm() {
        return (
            fields.oldPassword.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }
    async function handleChangeClick(event) {
        event.preventDefault();
        setIsChanging(true);
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(
                currentUser,
                fields.oldPassword,
                fields.password
            );
            navigate("/settings");
        } catch (error) {
            onError(error);
            setIsChanging(false);
        }
    }
    return (
        <div className="ChangePassword">
            <form onSubmit={handleChangeClick}>
                <FormGroup bsSize="large" controlId="oldPassword">
                    <FormLabel>Old Password</FormLabel>
                    <FormControl
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.oldPassword}
                    />
                </FormGroup>
                <hr />
                <FormGroup bsSize="large" controlId="password">
                    <FormLabel>New Password</FormLabel>
                    <FormControl
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.password}
                    />
                </FormGroup>
                <FormGroup bsSize="large" controlId="confirmPassword">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.confirmPassword}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    disabled={!validateForm()}
                    isLoading={isChanging}
                >
                    Change Password
                </LoaderButton>
            </form>
        </div>
    );
}
