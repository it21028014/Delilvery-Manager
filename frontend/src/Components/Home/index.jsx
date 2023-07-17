import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import SiteLoading from "../Common/Siteloading/SiteLoading";
import { GetApiCaller } from "../../Services/ApiCaller";
import deliveryImg from "./img/delivery_partner.png";
import orderImg from "./img/order_details.png";
import welcomeImg from "./img/welcome-img.jpg";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const Index = () => {
  const [isLoad, setLoad] = useState(false);
  const [DataPie, setDataPie] = useState({});
  const [OptionPie, setOptionPie] = useState({});
  const [DataBar, setDataBar] = useState({});
  const [OptionBar, setOptionBar] = useState({});
  const [isDataLoad, setDataLoad] = useState(false);

  const navigate = useNavigate();
  const fnOnClickBtn = (type) => {
    if (type === "o") {
      navigate("/order");
    } else {
      navigate("/deliveryPartner");
    }
  };

  useEffect(() => {
    fnFetchData();
  }, []);

  const fnFetchData = async () => {
    setLoad(true);
    const resData = await GetApiCaller("deliveryPartner/getChartData");
    setLoad(false);
    if (resData.booStatus) {
      // Pie Chart
      let arrDataPie = [];
      let arrLabelPie = [];
      resData.objResponse.map((val) => {
        arrDataPie.push(val.ordersDone);
        arrLabelPie.push(val.name);
      });
      let delayed;
      const dataPie = {
        datasets: [
          {
            data: arrDataPie,
            backgroundColor: [
              "#003f5c",
              "#58508d",
              "#bc5090",
              "#ff6361",
              "#ffa600",
            ],
            hoverOffset: 4,
          },
        ],

        labels: arrLabelPie,
      };
      const optionsPie = {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },

        plugins: {
          legend: {
            position: "top",
          },
          // title: {
          //   display: true,
          //   text: 'Delivery Partner Completed Orders',
          // },
        },
      };
      setDataPie(dataPie);
      setOptionPie(optionsPie);

      // Bar Chart
      let arrDataBar = [];
      let arrLabelBar = [];
      resData.objResponse.map((val) => {
        arrDataBar.push(val.totalPayment);
        arrLabelBar.push(val.name);
      });
      const dataBar = {
        datasets: [
          {
            label: "Total Payment",
            data: arrDataBar,
            backgroundColor: "#006E7F",
          },
        ],
        labels: arrLabelBar,
      };
      const optionsBar = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          // title: {
          //   display: true,
          //   text: "Delivery Partner Payment Details",
          // },
        },
      };
      setDataBar(dataBar);
      setOptionBar(optionsBar);

      setDataLoad(true);
    } else {
      setDataLoad(false);
    }
  };

  return (
    <div className="dp-wrap">
      <img src={welcomeImg} alt="Background" className="dp-bg" />
      {isLoad && <SiteLoading />}
      <div className="container dp-content">
        <div className="row jumbotron">
          <div className="col-12 d-flex justify-content-center ">
            <h1 className="headline-1">Welcome</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <span>
              <i className="fa fa-user-circle user-icon" aria-hidden="true"></i>
            </span>
          </div>
        </div>
        <div className="row mt-2 mb-5">
          <div className="col-md-6 d-flex justify-content-center">
            <div
              className="card text-center card-delivery"
              style={{ width: "25rem" }}
            >
              <img
                src={deliveryImg}
                alt="Orders"
                className="card-img-top rounded mx-auto d-block"
                style={{ width: "32vh" }}
              />
              <div className="card-body">
                <button
                  type="button"
                  className="btn btn_delivery w-100"
                  onClick={() => fnOnClickBtn("o")}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-center">
            <div
              className="card text-center card-delivery"
              style={{ width: "25rem" }}
            >
              <img
                src={orderImg}
                alt="Manage Delivery Partners"
                className="card-img-top rounded mx-auto d-block"
                style={{ width: "30vh" }}
              />
              <div className="card-body">
                <button
                  type="button"
                  className="btn btn_delivery w-100"
                  onClick={() => fnOnClickBtn("d")}
                >
                  Manage Delivery Partners
                </button>
              </div>
            </div>
          </div>
        </div>
        {isDataLoad && (
          <div className="row mt-5">
            <div className="col-6 d-flex justify-content-center">
              <div className="card border-secondary text-dark bg-light mb-3 w-100">
                <div className="card-body">
                  <h5 className="card-title">
                    Delivery Partner Completed Orders
                  </h5>
                  <Pie
                    data={DataPie}
                    options={OptionPie}
                    width={50}
                    height={50}
                  />
                </div>
              </div>
            </div>
            <div className="col-6 d-flex justify-content-center">
              <div className="card border-secondary text-dark bg-light mb-3 w-100">
                <div className="card-body">
                  <h5 className="card-title">
                    Delivery Partner Payment Details
                  </h5>
                  <Bar data={DataBar} options={OptionBar} width={50} height={50} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
