import firebase from "../firebase";
import {Button, Form} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import bgImage from "../events.jpg";
import React, {useState} from "react";
import {v4 as uuidv4} from "uuid";


export function CreateAdmin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null)

    const db = firebase.firestore();
    let history = useHistory();

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            history.push('/');
            document.body.style.backgroundImage = `url(${bgImage})`
        }
    });

    const register = () => {
        const config = {apiKey: "AIzaSyDFune4-F1_Xqy5qklHdil12SF-92qCy_g",
            authDomain: "eventsapp-45c2f.firebaseapp.com",
            projectId: "eventsapp-45c2f",
            storageBucket: "eventsapp-45c2f.appspot.com",
            messagingSenderId: "58641160739",
            appId: "1:58641160739:web:17160f68e2010ffff9ef96",
            measurementId: "G-Y1LVGSF8VN"};
        const secondaryApp = firebase.initializeApp(config, "Secondary");

        secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(function() {
            console.log("User created successfully!");
            //I don't know if the next statement is necessary
            resetInput();
            setMessage("Registration successful.")
            const newUser = {
                id: uuidv4(),
                mail: email,
                type: "admin",
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
                setMessage(err.message);
            });
            //secondaryApp.auth().signOut();
        }

    const handleSwitch = () => {
        history.push('/events')
    }

    const resetInput = () => {
        document.getElementById("1").value = ""
        document.getElementById("2").value = ""
    };

    const logOut = () => {
        firebase.auth().signOut().then(() => {
            history.push('/');
            document.body.style.backgroundImage = `url(${bgImage})`
        });
    };

    return(
        <div>
            {/* FORMA */}
            <Button onClick={handleSwitch} variant="primary" className={"lgout"}>Events</Button>
            <Button onClick={logOut} variant="danger" className={"lgout"}>Log Out</Button>

            <h1 className={"signuptext"}>Create admin user</h1>
            <Form>
                <Form.Group controlId="formGroupEmail">
                    <Form.Label className={"signuplabels"}>Email address</Form.Label>
                    <Form.Control id="1" className={"signupinputs"} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label className={"signuplabels"}>Password</Form.Label>
                    <Form.Control id="2" className={"signupinputs"} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                </Form.Group>

                <Button onClick={register} variant="primary" className={"left-most"}>Create</Button>

                <p className={"myerror"}>{message ? message : null}</p>
            </Form>
        </div>
    )
}