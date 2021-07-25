import {Button, Table, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import firebase from "../firebase";


export function MyEvents(props) {
    const [userEvents, setUserEvents] = useState([]);

    const db = firebase.firestore();
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        db.collection("users").where("mail", "==", currentUser.email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setUserEvents(doc.data().events)
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    // eslint-disable-next-line
    },[props])

    return(
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    See the list of events you're attending
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>My events</h4>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Place</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userEvents.map((uEvent) => (
                    <tr key={uEvent.id}>
                        <td>{uEvent.name}</td>
                        <td>{uEvent.type}</td>
                        <td>{uEvent.country}, {uEvent.town}</td>
                        <td>{uEvent.date}</td>
                    </tr>
                    ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}><b>Close</b></Button>
            </Modal.Footer>
        </Modal>
    )
}