import React, { useEffect, useState } from "react";
import "./order.css";
import GridFunctions from "../Common/Grid/GridFunctions";
import { PostApiCaller, GetApiCaller } from "../../Services/ApiCaller"
import SiteLoading from "../Common/Siteloading/SiteLoading";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import bgImg from "./img/orders-img.jpg";

const Index = () =>{
  const [isLoad, setLoad] = useState(false);
  const [datasetGrid, setDatasetGrid] = useState([]);
  const [dpName, setDpName] = useState([]);
  const [isShowAsssignModal, setShowAsssignModal] = useState(false);
  const [selectedRow, setSelecetedRow] = useState({});
  const [objInput, setInput] = useState({
    deliveryPartnerName: "default",
    estimatedDeliveryDate: "",
  });

  useEffect(()=>{
    fnFetchOrderDet();
    fnFetchDeliveryPartDet();
  }, []);

  const fnFetchOrderDet = async () => {
    setLoad(true);
    const resData = await GetApiCaller("deliveryPartner/getOrders");
    setLoad(false);
    if (resData.booStatus) {
      setDatasetGrid(resData.objResponse);
    } else {
      fnAlert(false, resData.objResponse);
    }
  }

  const fnFetchDeliveryPartDet = async () => {
    setLoad(true);
    const resData = await GetApiCaller("deliveryPartner/getDeliveryPartners");
    setLoad(false);
    if (resData.booStatus) {
      setDpName(resData.objResponse);
    } else {
      fnAlert(false, resData.objResponse);
    }
  }

  const fnAlert = (booSucess, msg) => {
    return Swal.fire({
      icon: booSucess ? "success" : "error",
      title: booSucess ? msg : "Something wrong!",
      text: !booSucess ? msg : "",
    });
  };

  const fnOnChange = (e) => {
    setInput((objInput) => ({
      ...objInput,
      [e.target.name]: e.target.value,
    }));
  };

  const columns = [
    {
      name: "Order ID",
      grow: 1,
      selector: "orderId",
    },
    {
      name: "Address",
      grow: 1,
      selector: "address",
    },
    {
      name: "Weight (Kg)",
      grow: 1,
      selector: "weight",
    },
    {
      name: "District",
      grow: 1,
      selector: "district",
    },
    {
      name: "Contact No.",
      grow: 1,
      selector: "custContactNo",
    },
    {
      name: "Estimated Delivery Date",
      grow: 1,
      cell: (row) => 
        <span>
          {row.estimatedDeliveryDate !== undefined ? new Date(row.estimatedDeliveryDate).toLocaleDateString(): ""}
        </span>,
    },
    {
      name: "Delivered Date",
      grow: 1,
      cell: (row) => 
        <span>
          {row.DeliveredDate !== undefined ? new Date(row.DeliveredDate).toLocaleDateString() : ""}
        </span>,
    },
    {
      name: "Delivery Partner",
      grow: 1,
      selector: "deliveryPartnerName",
    },
    {
      name: "Delivery Price",
      grow: 1,
      selector: "deliveryPrice",
    },
    {
      name: "Total Price",
      grow: 1,
      selector: "totalPrice",
    },
    {
      name: "Action",
      grow: 0.5,
      cell: (row) => (
        <>
          {row.deliveryStatus === "p" && (
            <button
              className="btn btn-sm btn-success me-1 p-2"
              onClick={() => fnGridAssign(row)}
            >
              <i className="fa fa-plus-circle" />
            </button>
          )}
          <button
            className="btn btn-sm btn-danger p-2"
            onClick={() => fnGridDelete(row)}
          >
            <i className="fas fa-trash" />
          </button>
        </>
      ),
    },
  ];

  const fnGridDelete = (row) =>{
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fnDeleteOrder(row);
      }
    })
  }

  const fnDeleteOrder = async (row) =>{
    setLoad(true);
    const resDelete = await PostApiCaller("deliveryPartner/deleteOrder", {orderId: row.orderId});
    setLoad(false);
    if (resDelete.booStatus) {
      fnAlert(true, resDelete.objResponse);
      fnFetchOrderDet();
    } else {
      fnAlert(false, resDelete.objResponse);
    }
  } 

  const fnGridAssign = (row) =>{
    setSelecetedRow(row);
    setShowAsssignModal(true);
  }

  const fnAssignModal = () =>{
    return (
      <div className="dp-content">
        <Modal
          show={isShowAsssignModal}
          onHide={() => {
            setShowAsssignModal(false);
          }}
          backdrop="static"
          keyboard={false}
          centered
          size="lg"
        >
          <Modal.Header closeButton style={{ backgroundColor: "#f3c029f5" }}>
            <Modal.Title>Assign Delivery Partner</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 d-flex justify-content-center">
              <div className="col-5">
                <select className="form-select" onChange={fnOnChange} name="deliveryPartnerName">
                  <option selected value="default">Select Delivery Partner</option>
                  {dpName.map((dp)=>{
                    return(<>
                      <option value={dp}>{dp}</option>
                    </>)
                  })}
                </select>
              </div>
            </div>
            <div className="row mt-3 d-flex justify-content-center">
              <div className="col-5">
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    className="form-control"
                    id="estimatedDeliveryDate"
                    placeholder="Estimated Delivery Date"
                    name="estimatedDeliveryDate"
                    onChange={(e) => fnOnChange(e)}
                    value={objInput.estimatedDeliveryDate}
                  />
                  <label htmlFor="estimatedDeliveryDate">Estimated Delivery Date</label>
                </div>
              </div>
            </div>
            <div className="row mt-3 mb-2 d-flex justify-content-center">
              <div className="col-4">
                <button type="button" className="btn btn-success w-100" onClick={fnSaveDp}>
                  Save
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

      </div>
    );
  }

  const fnSaveDp = async () =>{
    if(objInput.deliveryPartnerName === "default"){
      fnAlert(false, "Please select delivery partner");
    } else if(objInput.estimatedDeliveryDate === ""){
      fnAlert(false, "Please select estimated delivery date");
    } else{
      const objSave = {
        ...objInput,
        orderId: selectedRow.orderId
      }
      setLoad(true);
      const resAssignDp = await PostApiCaller("deliveryPartner/assignDp", objSave)
      setLoad(false);
      if (resAssignDp.booStatus) {
        fnAlert(true, resAssignDp.objResponse);
        fnReset();
        setShowAsssignModal(false);
        fnFetchOrderDet();
      } else {
        fnAlert(false, resAssignDp.objResponse);
      }
    }
  }

  const fnReset = () =>{
    setInput((objInput) => ({
      ...objInput,
      deliveryPartnerName: "default",
      estimatedDeliveryDate: "",
    }));
    setSelecetedRow({});
  }

  return (
    <div className="dp-wrap" style={{height: "100vh"}}>
      <img src={bgImg} alt="Background" className="dp-bg" />
      {isLoad && <SiteLoading />}
      {fnAssignModal()}
      <div className="row mt-2 dp-content">
        <div className="container-fluid" style={{ width: "98vw" }}>
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <h1>Orders</h1>
            </div>
          </div>
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <fieldset className="form-group">
                <div className="container-fluid mt-1 mb-1">
                  <div className="row">
                    <div className="col-md-12 mt-3">
                      <GridFunctions
                        title="Orders"
                        columns={columns}
                        dataSet={datasetGrid}
                        strHeight={"40vh"}
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
}

export default Index