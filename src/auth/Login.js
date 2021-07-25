import React, { useState } from "react";
import firebase from "./../firebase";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import {v4 as uuidv4} from "uuid";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    let history = useHistory();
    const db = firebase.firestore();

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            history.push('/events');
        }
    });

    const register = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                resetInput();
                setError("Registration successful.")
                const newUser = {
                    id: uuidv4(),
                    mail: email,
                    type: "user",
                    events: []
                }
                db.collection("users").doc(newUser.id).set(newUser)
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const login = () => {
        console.log("")
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                history.push('/events')
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const resetInput = () => {
        document.getElementById("1").value = ""
        document.getElementById("2").value = ""
    };

    return (
        <div>
            <h1 className={"signuptext"}>EventsApp - Sign up / Log In</h1>
            <Form>
                <Form.Group controlId="formGroupEmail">
                    <Form.Label className={"signuplabels"}>Email address</Form.Label>
                    <Form.Control id="1" className={"signupinputs"} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label className={"signuplabels"}>Password</Form.Label>
                    <Form.Control id="2" className={"signupinputs"} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                </Form.Group>

                <Button onClick={register} variant="primary" className={"left-most"}>Register</Button>
                <Button onClick={login} variant="primary" className={"linlout"}>Log In</Button>

                <p className={"myerror"}>{error ? error : null}</p>
            </Form>
        </div>
    );
};