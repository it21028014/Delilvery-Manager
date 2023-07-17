import React, { useEffect, useState } from "react";
import "./delivery.css";
import GridFunctions from "../Common/Grid/GridFunctions";
import { PostApiCaller, GetApiCaller } from "../../Services/ApiCaller"
import SiteLoading from "../Common/Siteloading/SiteLoading";
import Modal from "react-bootstrap/Modal";
import { Stepper, Step } from "react-form-stepper";
import Swal from "sweetalert2";
import printJS from "print-js";
import bgImg from "./img/dp-img.jpg";

const Index = () => {
  const [datasetGrid, setDatasetGrid] = useState([]);
  const [isShowModal, setShowModal] = useState(false);
  const [objInput, setInput] = useState({
    vehicleNo: "",
    vehicleType: "",
    capacity: "",
    yearOfManufact: 0,
    freezer: "yes",
    name: "",
    bankName: "",
    accNo: "",
    branchName: "",
    branchNo: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    nic: "",
    licenseNo: "",
    address: "",
    password: "",
    password2: "",
  });

  const [goSteps, setGoSteps] = useState(0);
  const [isLoad, setLoad] = useState(false);
  
  useEffect(()=>{
    fnFetchDP();
  }, []);

  const fnFetchDP = async () => {
    setLoad(true);
    const resData = await GetApiCaller("deliveryPartner/deliveryPartnerDet");
    setLoad(false);
    if (resData.booStatus) {
      setDatasetGrid(resData.objResponse);
    } else {
      fnAlert(false, resData.objResponse);
    }
  }

  const fnOnChange = (e) => {
    setInput((objInput) => ({
      ...objInput,
      [e.target.name]: e.target.value,
    }));
  };

  const fnAlert = (booSucess, msg) => {
    return Swal.fire({
      icon: booSucess ? "success" : "error",
      title: booSucess ? msg : "Something wrong!",
      text: !booSucess ? msg : "",
    });
  };

  const columns = [
    {
      name: "Driver ID",
      grow: 1,
      selector: "driverId",
    },
    {
      name: "Name",
      grow: 1,
      cell: (row) => 
      <span>
        {row.firstName + " " + row.lastName}
      </span>,
    },
    {
      name: "Vehicle No",
      grow: 1,
      selector: "vehicleNo",
    },
    {
      name: "Orders Done",
      grow: 1,
      selector: "ordersDone",
    },
    {
      name: "Incomplete Orders",
      grow: 1,
      selector: "incompleteOrders",
    },
    {
      name: "Total Delivery Charges",
      grow: 1,
      selector: "totalPayment",
    },
    {
      name: "Driver's Phone No",
      grow: 1,
      selector: "phoneNo",
    },
    {
      name: "Action",
      grow: 0.5,
      cell: (row) => (
        <>
          <button
            className="btn btn-sm btn-danger m-0 p-2"
            onClick={() => fnGridDelete(row)}
          >
            <i className="fas fa-trash" />
          </button>
        </>
      ),
    },
  ];

  const fnGridDelete = (row) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fnDeleteDeliveryPartner(row);
      }
    })
  }

  const fnDeleteDeliveryPartner = async (row) =>{
    setLoad(true);
    const resDelete = await PostApiCaller("deliveryPartner/deleteDeliveryPartner", {driverId: row.driverId});
    setLoad(false);
    if (resDelete.booStatus) {
      fnAlert(true, resDelete.objResponse);
      fnFetchDP();
    } else {
      fnAlert(false, resDelete.objResponse);
    }
  } 

  const fnAddNewBtn = async () => {
    setShowModal(true);
  };

  const fnInputs = (type, id, placeholder, value) =>{
    return (
      <>
        <div className="form-floating mb-3">
          <input
            type={type}
            className="form-control"
            id={id}
            placeholder={placeholder}
            name={id}
            onChange={(e) => fnOnChange(e)}
            value={value}
          />
          <label htmlFor={id}>{placeholder}</label>
        </div>
      </>
    );
  }

  const fnAddNewDeliveryModal = () => {
    return (
      <div className="dp-content">
        <Modal
          show={isShowModal}
          onHide={() => {
            setShowModal(false);
          }}
          backdrop="static"
          keyboard={false}
          centered
          size="xl"
        >
          <Modal.Header closeButton style={{ backgroundColor: "#f3c029f5" }}>
            <Modal.Title>Delivery Partner Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <Stepper activeStep={goSteps}>
                  <Step onClick={() => setGoSteps(0)} label="DRIVER DETAILS" />
                  <Step onClick={() => setGoSteps(1)} label="VEHICLE DETAILS" />
                  <Step onClick={() => setGoSteps(2)} label="BANK DETAILS" />
                </Stepper>
                {goSteps === 0 && (
                  <div className="container mt-4">
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <h4>
                          <i className="fa fa-user" aria-hidden="true"></i>{" "}
                          Driver Details{" "}
                        </h4>
                      </div>
                    </div>
                    <div className="row mt-3 d-flex justify-content-center">
                      <div className="col-4">
                        {fnInputs(
                          "text",
                          "firstName",
                          "First Name",
                          objInput.firstName
                        )}
                      </div>
                      <div className="col-4">
                        {fnInputs(
                          "text",
                          "lastName",
                          "Last Name",
                          objInput.lastName
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "phoneNo",
                          "Phone No",
                          objInput.phoneNo
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "nic",
                          "NIC",
                          objInput.nic
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "licenseNo",
                          "Driving License Number",
                          objInput.licenseNo
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "address",
                          "Address",
                          objInput.address
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "password",
                          "password",
                          "Create Password",
                          objInput.password
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "password",
                          "password2",
                          "Confirm Password",
                          objInput.password2
                        )}
                      </div>
                    </div>
       

                    <div className="row d-flex justify-content-center mt-3">
                      <div className="col-3">
                        <button
                          type="button"
                          className="btn btn-outline-warning w-100"
                          onClick={() => fnNext(1)}
                        >
                          <b>
                            NEXT{" "}
                            <i
                              className="fa fa-arrow-circle-right ms-2"
                              aria-hidden="true"
                            />
                          </b>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {goSteps === 1 && (
                  <div className="container mt-4">
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <h4>
                          <i className="fa fa-car" aria-hidden="true"></i>{" "}
                          Vehicle Details{" "}
                        </h4>
                      </div>
                    </div>
                    <div className="row mt-3 d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "vehicleNo",
                          "Vehicle No",
                          objInput.vehicleNo
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "vehicleType",
                          "Vehicle Type",
                          objInput.vehicleType
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "capacity",
                          "Capacity",
                          objInput.capacity
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "number",
                          "yearOfManufact",
                          "Year Of Manufactured",
                          objInput.yearOfManufact
                        )}
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col-12 d-flex justify-content-center">
                        <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                          Availability Of Freezer
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="freezer"
                            id="yes"
                            value="yes"
                            checked={objInput.freezer === "yes"}
                            onChange={fnOnChange}
                          />
                          <label className="form-check-label" htmlFor="yes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="freezer"
                            id="no"
                            value="no"
                            checked={objInput.freezer === "no"}
                            onChange={fnOnChange}
                          />
                          <label className="form-check-label" htmlFor="no">
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row d-flex justify-content-center mt-3">
                      <div className="col-3">
                        <button
                          type="button"
                          className="btn btn-outline-warning w-100"
                          onClick={() => fnNext(2)}
                        >
                          <b>
                            NEXT{" "}
                            <i
                              className="fa fa-arrow-circle-right ms-2"
                              aria-hidden="true"
                            />
                          </b>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {goSteps === 2 && (
                  <div className="container mt-4">
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <h4>
                          <i
                            className="fa fa-university"
                            aria-hidden="true"
                          ></i>{" "}
                          Bank Details{" "}
                        </h4>
                      </div>
                    </div>
                    <div className="row mt-3 d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs("text", "name", "Name", objInput.name)}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "bankName",
                          "Bank Name",
                          objInput.bankName
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "accNo",
                          "Bank Account Number",
                          objInput.accNo
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "branchName",
                          "Bank Branch",
                          objInput.branchName
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-6">
                        {fnInputs(
                          "text",
                          "branchNo",
                          "Branch Number",
                          objInput.branchNo
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center mt-3">
                      <div className="col-3">
                        <button
                          type="button"
                          className="btn btn-outline-warning w-100"
                          onClick={() => fnNext(3)}
                        >
                          <b>
                            Submit{" "}
                            <i
                              className="fa fa-check-circle ms-2"
                              aria-hidden="true"
                            />
                          </b>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  const fnNext = async (no) =>{
    if(no === 1){
      if(objInput.firstName === ""){
        fnAlert(false, "Please enter first name")
      } else if(objInput.lastName === ""){
        fnAlert(false, "Please enter last name")
      } else if(objInput.phoneNo === "" ){
        fnAlert(false, "Please enter phone no.")
      } else if(objInput.phoneNo.length !== 10){
        fnAlert(false, "Please enter valid phone no.")
      } else if(objInput.nic === ""){
        fnAlert(false, "Please enter NIC")
      } else if(objInput.nic.length !== 10){
        fnAlert(false, "Please enter valid NIC")
      } else if(objInput.licenseNo === ""){
        fnAlert(false, "Please enter driving license no.")
      } else if(objInput.address === ""){
        fnAlert(false, "Please enter address")
      } else if(objInput.password === ""){
        fnAlert(false, "Please enter password")
      } else if(objInput.password !== objInput.password2){
        fnAlert(false, "Invalid password")
      } else{
        setGoSteps(1);
      }
    }
    else if(no === 2){
      if(objInput.vehicleNo === ""){
        fnAlert(false, "Please enter vehicle no.")
      } else if(objInput.vehicleType === ""){
        fnAlert(false, "Please enter vehicle type")
      } else if(objInput.capacity === "" ){
        fnAlert(false, "Please enter capacity")
      } else if(objInput.yearOfManufact === "0"){
        fnAlert(false, "Please enter year of manufactured")
      } else if(objInput.freezer === ""){
        fnAlert(false, "Please select freezer availability")
      } else{
        setGoSteps(2);
      }
    }
    else{
      if(objInput.name === ""){
        fnAlert(false, "Please enter name")
      } else if(objInput.bankName === ""){
        fnAlert(false, "Please enter bank name")
      } else if(objInput.accNo === "" ){
        fnAlert(false, "Please enter bank account no.")
      } else if(objInput.branchName === ""){
        fnAlert(false, "Please enter branch name")
      } else if(objInput.branchNo === ""){
        fnAlert(false, "Please select branch no.")
      } else{
        setLoad(true);
        const resSave = await PostApiCaller("deliveryPartner/saveDeliveryPartner", objInput);
        setLoad(false);
        if (resSave.booStatus) {
          fnAlert(true, resSave.objResponse);
          setGoSteps(0);
          setShowModal(false);
          fnReset();
          fnFetchDP();
        } else {
          fnAlert(false, resSave.objResponse);
        }
      }
    }

  }

  const fnReset = () =>{
    setInput((objInput)=> ({
      ...objInput,
      vehicleNo: "",
      vehicleType: "",
      capacity: "",
      yearOfManufact: 0,
      freezer: "yes",
      name: "",
      bankName: "",
      accNo: "",
      branchName: "",
      branchNo: "",
      firstName: "",
      lastName: "",
      phoneNo: "",
      nic: "",
      licenseNo: "",
      address: "",
      password: "",
      password2: "",
    }))
  }

  const fnPrintBtn = async () =>{
    setLoad(true);
    const resPrint = await PostApiCaller("deliveryPartner/printDP");
    setLoad(false);
    if (resPrint.booStatus) {
      printJS({ printable: resPrint.objResponse, type: "pdf", base64: true });
    } else {
      fnAlert(false, resPrint.objResponse);
    }
  }

  return (
    <div className="dp-wrap" style={{height: "100vh"}}>
      <img src={bgImg} alt="Background" className="dp-bg" />
      {isLoad && <SiteLoading />}
      {fnAddNewDeliveryModal()}
      <div className="row mt-2 dp-content">
        <div className="container-fluid" style={{ width: "98vw" }}>
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <h1>Delivery Partner</h1>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-3">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={fnAddNewBtn}
              >
                <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>{" "}
                Add New Delivery Partner
              </button>
            </div>
            <div className="col-3">
              <button
                type="button"
                className="btn btn-warning w-100"
                onClick={fnPrintBtn}
              >
                <i className="fa fa-print me-2" aria-hidden="true"></i>{" "}
                Print
              </button>
            </div>
          </div>
          <div className="row mt-4 justify-content-center">
            <div className="col-12">
              <fieldset className="form-group">
                <div className="container-fluid mt-1 mb-1">
                  <div className="row">
                    <div className="col-md-12 mt-3">
                      <GridFunctions
                        title="Delivery Partner"
                        columns={columns}
                        dataSet={datasetGrid}
                        strHeight={"35vh"}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
