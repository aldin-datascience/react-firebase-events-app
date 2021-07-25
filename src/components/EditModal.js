import {Modal, Button, Form} from 'react-bootstrap';
import {useState,useEffect} from "react";
import firebase from "../firebase";

export function EditModal(props){
    const [message, setMessage] = useState(null)
    const [fileUrl, setFileUrl] = useState(null)

    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [date, setDate] = useState("")
    const [country, setCountry] = useState("")
    const [town, setTown] = useState("")

    useEffect(() => {
        console.log("PROPS")
        setType(props.type)
        setName(props.name)
        setDate(props.date)
        setCountry(props.country)
        setTown(props.town)
    },[props])

    const db = firebase.firestore();

    const handleFile = async e => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        // Potrebno za cuvanje slike u kolekciji
        setFileUrl(await fileRef.getDownloadURL())
    }

    const handleUpload = (e) => {
        e.preventDefault()
        const newEvent = {
            id: props.id,
            name: e.target.name.value,
            type: e.target.type.value,
            country : e.target.country.value,
            date: e.target.date.value,
            town: e.target.town.value,
            picture: fileUrl !== null ? fileUrl : props.picture
        }

        if(!newEvent.name || !newEvent.country || !newEvent.date || !newEvent.town || !newEvent.picture){
            setMessage("Please fill in all of the input fields.")
            return
        }
        db.collection("events").doc(props.id).update(newEvent).then(() => {
            setMessage("Document successfully updated!");
        }).catch((error) => {
            setMessage("Error updating document: " + error);
        });
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit the event
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Change input fields and click "Save changes"</h4>
                <Form className={"eventform"} onSubmit={handleUpload}/*handleUpload*/>
                    <Form.Group>
                        <Form.Label className={"signuplabels"}>Event name</Form.Label>
                        <Form.Control value={name} className={"signupinputs"}
                                      name="name" type="text" placeholder="Enter name"
                                      onChange={(e) => {setName(e.target.value)}}/>
                    </Form.Group>

                    <div className="form-group">
                        <label className={"signuplabels"}>Type</label>
                        <select name="type" value={type} onChange={(e) => {setType(e.target.value)}}
                                className="form-control signupinputs" id="exampleFormControlSelect1">
                            <option>Sports</option>
                            <option>Music</option>
                            <option>Science</option>
                            <option>Movies</option>
                        </select>
                    </div>

                    <Form.Group>
                        <Form.Label className={"signuplabels"}>Country</Form.Label>
                        <Form.Control value={country} onChange={(e) => {setCountry(e.target.value)}}
                                      className={"signupinputs"} name="country" type="text" placeholder="Enter a country"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className={"signuplabels"}>Town</Form.Label>
                        <Form.Control value={town} onChange={(e) => {setTown(e.target.value)}}
                                      className={"signupinputs"} name="town" type="text" placeholder="Enter a town"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className={"signuplabels"}>Date</Form.Label>
                        <Form.Control value={date} onChange={(e) => {setDate(e.target.value)}}
                                      className={"signupinputs"} name="date" type="date" placeholder="Enter a date" />
                    </Form.Group>

                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className={"signuplabels"}>Picture</Form.Label>
                        <Form.Control onChange={handleFile} className={"signupinputs"} type="file"/>
                    </Form.Group>

                    <Button className={"left-most"} type={"submit"} variant="primary">Save changes</Button>
                    <p className={"myerror"}>{message ? message : null}</p>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}><b>Close</b></Button>
            </Modal.Footer>
        </Modal>
    );
}