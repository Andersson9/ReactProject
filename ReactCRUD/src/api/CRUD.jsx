import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CRUD = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const[name,setName] = useState("")
    const[age,setAge] = useState("")
    const[isActive,setIsActive] = useState(0)

    const[editID,setEditID] = useState('')
    const[editname,setEditName] = useState("")
    const[editage,setEditAge] = useState("")
    const[editIsActive,setEditIsActive] = useState(false)

    const empdata = [
        {
            id: 1,
            name: "John",
            age: 29,
            isActive: 1
        },
        {
            id: 2,
            name: "Andersson",
            age: 23,
            isActive: 1
        },
        {
            id: 3,
            name: "Luke",
            age: 31,
            isActive: 0
        }
    ]


    const [data, setData] = useState([]);

    useEffect(() => {
       getData();
    }, [])

    const getData = async () => {
        await axios.get("https://localhost:7243/api/Employee")
        .then((result) =>{
          setData(result.data)  
          console.log(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleEdit =  async (id) => {
        handleShow()
        await axios.get(`https://localhost:7243/api/Employee/${id}`)
        .then((result)=>{
            setEditName(result.data.name)
            setEditAge(result.data.age)
            setEditIsActive(result.data.isActive)
            setEditID(result.data.id)
        })
    }
     
    const handleSave = async () =>{
        const url = "https://localhost:7243/api/Employee"
        const data = {
            "name": name,
            "age": age,
            "isActive":isActive
        }

        try{
           await axios.post(url,data)
            .then((result)=>{
                getData();
                clear();
                toast.success("Employee has been added");
            })
        } catch(error){
            console.log(error)
            toast.error("An error occurred")
        }
        
    }

    const clear = () => {
        setName('')
        setAge('')
        setIsActive(0)
        setEditName('')
        setEditAge('')
        setEditIsActive(0)
        setEditID('')
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee") == true) {
          
          await axios.delete(`https://localhost:7243/api/Employee/${id}`)
            .then((result) => {
                getData();
                if(result.status === 2000)
                toast.success("Employee deleted")
            }).catch((error) => {
                toast.error("An error occurred")
            })
      

            }
    }
    
    const handleActiveChange = (e) => {
       if(e.target.checked == true){
            setIsActive(true)
       } else{
        setIsActive(false)
       }
    }
    const handleEditActiveChange = (e) => {
        if(e.target.checked == true){
             setEditIsActive(true)
        } else{
         setEditIsActive(false)
        }
     }
    const handleUpdate = () => {
        const url = `https://localhost:7243/api/Employee/${editID}`
        const data = {
            "name":editname,
            "age":editage,
            "isActive":editIsActive,
            "id":editID
        }
        try{
            axios.put(url,data).then((result) => {
                getData()
                clear()
                toast.success("Employee has been updated");
                handleClose()
            })
          
        } catch{
            console.log(error)
            toast.error("An error occurred")
        }
    }

    return (
        <Fragment>
            <ToastContainer/>
            <Container>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" 
                        value={name} onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" 
                        value={age} onChange={(e) => setAge(e.target.value)}/>
                    </Col>
                    <Col>
                        <input type="checkbox" 
                        checked={isActive ===   true? true: false}
                        onChange={(e) => handleActiveChange(e)} value={isActive}/>
                        <label>IsActive</label>
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>IsActive</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.age}</td>
                                        <td>{item.isActive}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            "Loading..."
                    }
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" 
                        value={editname} onChange={(e) => setEditName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" 
                        value={editage} onChange={(e) => setEditAge(e.target.value)}/>
                    </Col>
                    <Col>
                        <input type="checkbox" 
                        checked={editIsActive ===   true? true: false}
                        onChange={(e) => handleEditActiveChange (e)} value={editIsActive}/>
                        <label>IsActive</label>
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}


export default CRUD;