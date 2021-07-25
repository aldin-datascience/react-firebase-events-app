import firebase from "../firebase";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import React from "react";
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import bgImage from '../events.jpg';
import {EditModal} from './EditModal.js'
import {MyEvents} from './MyEvents.js'
import {Footer} from './Footer.js'

export function Events(){
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [myEventsModalShow, setMyEventsModalShow] = useState(false);
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [type, setType] = useState("All")

    let history = useHistory();

    const db = firebase.firestore();
    const currentUser = firebase.auth().currentUser;

    const handleCreate = () => {
        history.push('/events/create')
    }

    const logOut = () => {
        firebase.auth().signOut().then(() => {
            history.push('/');
            document.body.style.backgroundImage = `url(${bgImage})`
        });
    };

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            setLoggedInUser(user);
            document.body.style.backgroundImage ='none';
            document.body.style.backgroundColor ='#e9e1eb';
        } else {
            history.push('/');
            document.body.style.backgroundImage = `url(${bgImage})`
        }
    });

    useEffect(() => {
        db.collection("events").onSnapshot((querySnapshot) => {
            const items = []
            querySnapshot.forEach( (doc) => {
                items.push(doc.data())
            })
            setEvents(items)
        })

        //console.log("Logged in: ",loggedInUser)
        db.collection("users").where("mail", "==", currentUser.email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    setUser(doc.data())
                    setLoading(false)
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        // eslint-disable-next-line
    },[])

    const handleGoing = (e,event) => {
        e.preventDefault();
        let usersRef = db.collection("users").doc(user.id);
        if(attend(event) === true){
            usersRef.update({
                events: firebase.firestore.FieldValue.arrayRemove(event)

            }).then(() => {
                const index = user.events.indexOf(event);
                if (index > -1) {
                    user.events.splice(index, 1);
                }
                e.target.style.backgroundColor = 'gray'
            });
        }
        else if(attend(event) === false){
            usersRef.update({
                events: firebase.firestore.FieldValue.arrayUnion(event)
            }).then(() => {
                user.events.push(event)
                e.target.style.backgroundColor = 'lightgreen'
            });
        }
    }

    const handleRemove = (e,remove) => {
        e.preventDefault()
        db.collection("events").doc(remove.id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    function attend(event) {
        if(loading === false) {
            let ids = []
            for(let i = 0; i < user.events.length; i++){
                ids.push(user.events[i].id)
            }
            return ids.includes(event.id);
        }
    }

    const handleCreateAdmin = () => {
        history.push('/admin')
    }

    const handleType = (e) => {
        setType(e.target.value)
    }

    const isAdmin = () => {
        if(loading === false){
            return user.type === "admin";
        }
    }

    const [id, setId] = useState(0)
    const [name, setName] = useState("")
    const [etype, setEtype] = useState("")
    const [date, setDate] = useState("")
    const [town, setTown] = useState("")
    const [country, setCountry] = useState("")
    const [picture, setPicture] = useState("")

    const handleModal = (e) => {
        db.collection("events").where("id", "==", e.target.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    setId(doc.data().id)
                    setName(doc.data().name)
                    setEtype(doc.data().type)
                    setDate(doc.data().date)
                    setTown(doc.data().town)
                    setCountry(doc.data().country)
                    setPicture(doc.data().picture)
                    setEditModalShow(true)
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    return (
        <div>
            <Button id="ontop" onClick={handleCreate} variant="primary" className={"lgout"}
            disabled={!isAdmin()}>Create event</Button>
            <Button disabled={!isAdmin()} onClick={handleCreateAdmin} variant="primary" className={"lgout"}>Create admin</Button>
            <Button onClick={() => setMyEventsModalShow(true)} variant="primary" className={"lgout"}>My
                Events</Button>
            <Button onClick={logOut} variant="danger" className={"lgout"}>Log Out</Button>
            <span id={"loggedin"}>logged in as: <b>{loggedInUser ? loggedInUser.email : "Waiting for user..."}</b></span>
            <div className={"allevents"}>
                <h1 id={"upcomingHeading"}>Upcoming Events</h1>
                <Form>
                    <div className="form-group">
                        <select onChange={handleType} name="type" className="form-control signupinputs" id="exampleFormControlSelect1">
                            <option>All</option>
                            <option>Sports</option>
                            <option>Music</option>
                            <option>Science</option>
                            <option>Movies</option>
                        </select>
                    </div>
                </Form>
                {events.map((event) => (
                    <Card
                        style={{display : type === 'All' ? "block" : (type !== event.type ? "none" : "block")}}
                        className={"eventcard"} key={event.id}>
                        <Card.Img className={"pictures"} src={event.picture} variant="top"/>
                        <Card.Body>
                            <Card.Text>
                                <span id={"eventHeading"}>{event.name}</span>
                                <span className={"eventInfo"}>Type: {event.type}</span>
                                <span className={"eventInfo"}>Date: {event.date}</span>
                                <span className={"eventInfo"}>{event.town}, {event.country}</span>

                                <Button style={{backgroundColor: attend(event) ? 'lightgreen' : 'gray'}}
                                onClick={(e) => handleGoing(e,event)} variant={"primary"}
                                className={"btnlist going"}>I'm going</Button>

                                <Button id={event.id} variant="primary" onClick={handleModal}
                                        className={"btnlist"} disabled={!isAdmin()}>Edit Event</Button>
                                <Button onClick={(e) => handleRemove(e, event)} variant={"danger"}
                                        className={"btnlist"} disabled={!isAdmin()}>Remove Event</Button>

                                <MyEvents
                                    show={myEventsModalShow}
                                    onHide={() => setMyEventsModalShow(false)}
                                />


                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
                <EditModal
                    show={editModalShow}
                    id={id}
                    name={name}
                    type={etype}
                    date={date}
                    town={town}
                    country={country}
                    picture={picture}

                    onHide={() => setEditModalShow(false)}
                />
            </div>
            <Footer/>
        </div>
    )
}