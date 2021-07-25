import {Form, Button } from "react-bootstrap";
import {useState} from "react";
import {useHistory} from "react-router-dom";
import firebase from "../firebase";
import {v4 as uuidv4} from 'uuid'
import bgImage from "../events.jpg";

export function Create() {
    // Event Form Info
    const [fileUrl, setFileUrl] = useState(null)
    const [message, setMessage] = useState(null)

    let history = useHistory();

    const db = firebase.firestore();

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            history.push('/');
            document.body.style.backgroundImage = `url(${bgImage})`
        }
    });

    const handleFile = async e => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        // Potrebno za cuvanje slike u kolekciji
        setFileUrl(await fileRef.getDownloadURL())
    }

    const handleUpload = e => {
        e.preventDefault()
        const newEvent = {
            id: uuidv4(),
            name: e.target.name.value,
            type: e.target.type.value,
            country : e.target.country.value,
            date: e.target.date.value,
            town: e.target.town.value,
            picture: fileUrl
        }
        if(!newEvent.name || !newEvent.country || !newEvent.date || !newEvent.town || !newEvent.picture){
            setMessage("Please fill in all of the input fields.")
            return
        }
        db.collection("events").doc(newEvent.id).set(newEvent)
            .then(() => {
                setMessage("Document successfully written!");
            })
            .catch((error) => {
                setMessage(error)
            });
    }

    const handleSwitch = () => {
        history.push('/events')
    }

    const logOut = () => {
        firebase.auth().signOut().then(() => {
            history.push('/');
            document.body.style.backgroundImage = `url(${bgImage})`
        });
    };

    return (
        <div>
            {/* FORMA */}
            <Button onClick={handleSwitch} variant="primary" className={"lgout"}>Events</Button>
            <Button onClick={logOut} variant="danger" className={"lgout"}>Log Out</Button>
            <Form className={"eventform"} onSubmit={handleUpload}>
                <Form.Group>
                    <Form.Label className={"signuplabels"}>Event name</Form.Label>
                    <Form.Control className={"signupinputs"} name="name" type="text" placeholder="Enter name"/>
                </Form.Group>

                <div className="form-group">
                    <label className={"signuplabels"}>Type</label>
                    <select name="type" className="form-control signupinputs" id="exampleFormControlSelect1">
                        <option>Sports</option>
                        <option>Music</option>
                        <option>Science</option>
                        <option>Movies</option>
                    </select>
                </div>

                <Form.Group>
                    <Form.Label className={"signuplabels"}>Country</Form.Label>
                    <Form.Control className={"signupinputs"} name="country" type="text" placeholder="Enter a country"/>
                </Form.Group>

                <Form.Group>
                    <Form.Label className={"signuplabels"}>Town</Form.Label>
                    <Form.Control className={"signupinputs"} name="town" type="text" placeholder="Enter a town"/>
                </Form.Group>

                <Form.Group>
                    <Form.Label className={"signuplabels"}>Date</Form.Label>
                    <Form.Control className={"signupinputs"} name="date" type="date" placeholder="Enter a date" />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label className={"signuplabels"}>Picture</Form.Label>
                    <Form.Control className={"signupinputs"} onChange={handleFile} type="file"/>
                </Form.Group>

                <Button className={"left-most"} type={"submit"} variant="primary">Create</Button>
                <p className={"myerror"}>{message ? message : null}</p>
            </Form>
        </div>
    )
}