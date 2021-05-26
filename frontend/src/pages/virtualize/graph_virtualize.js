import homeIcon from "../../assets/icon/home.png";
import alarmClockIcon from "../../assets/icon/alarm-clock-gray.png";
import Chart from "react-apexcharts";
import axios from "axios";
import React, { useEffect, useState, Component } from "react";
import wrenchIcon from "../../assets/icon/wrench-gray.png";
import { Link, useLocation } from "react-router-dom";

var temp = "";
var data = "";
var prev = "";
var data_prePH = "",
  data_preEC = "",
  data_preDO = "",
  data_preTemp = "";
var arrConfigPH = [];
var arrConfigEC = [];
var arrConfigDO = [];
var arrConfigTemp = [];
function Graph() {
  // console.log(localStorage.getItem('device_id'))
  const [datapH, setDatapH] = useState([{ x: 0, y: 0 }]);
  const [dataEC, setDataEC] = useState([{ x: 0, y: 0 }]);
  const [dataDO, setDataDO] = useState([{ x: 0, y: 0 }]);
  const [dataTemp, setDataTemp] = useState([{ x: 0, y: 0 }]);
  const [data_raw, setData_raw] = useState([{}]);
  const [status, setStatus] = useState(false);
  const [schedules, setSchedules] = useState("");
  const [aleartPH, setAleartPH] = useState([]);
  const [aleartEC, setAleartEC] = useState([]);
  const [aleartDO, setAleartDO] = useState([]);
  const [aleartTemp, setAleartTemp] = useState([]);
  const [count, setCount] = useState(true)
  const [preData, setPreData] = useState(true)

  async function get_Data() {
    var config = {
      method: "get",
      url:
        "http://localhost:4001/data/" + localStorage.getItem("device_id"),
      headers: {},
    };

    await axios(config)
      .then(async function (response) {
        temp = await response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    return temp;
  }
  async function prepare_datapH(data) {
    var arrDatapH = [];
    for (let i = 0; i < data.length; i++) {
      let sumpH = { x: new Date(data[i].time).getTime(), y: data[i].ph };
      arrDatapH.push(sumpH);
    }
    return arrDatapH;
  }
  async function prepare_dataEC(data) {
    var arrDataEC = [];
    for (let i = 0; i < data.length; i++) {
      let sumEC = { x: new Date(data[i].time).getTime(), y: data[i].ec };
      arrDataEC.push(sumEC);
    }
    return arrDataEC;
  }
  async function prepare_dataDO(data) {
    var arrDataDoxy = [];
    for (let i = 0; i < data.length; i++) {
      let sumDO = { x: new Date(data[i].time).getTime(), y: data[i].doxy };
      arrDataDoxy.push(sumDO);
    }
    return arrDataDoxy;
  }
  async function prepare_dataTemp(data) {
    var arrDataTemp = [];
    for (let i = 0; i < data.length; i++) {
      let sumTemp = {
        x: new Date(data[i].time).getTime(),
        y: data[i].temperature,
      };
      arrDataTemp.push(sumTemp);
    }
    return arrDataTemp;
  }

  const chartDatapH = {
    options: {
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        min: 2,
        max: 9,
      },
      stroke: {
        curve: "smooth",
      },
      annotations: {
        yaxis: aleartPH,
      },
    },
    series: [
      {
        name: "Series 1",
        data: datapH,
      },
    ],
  };
  const chartDataEC = {
    options: {
      dataLabels: {
        enabled: false,
      },
      annotations: {
        yaxis: aleartEC,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        min: 0,
        max: 4,
      },
      stroke: {
        curve: "smooth",
      },
    },
    series: [
      {
        name: "Series 1",
        data: dataEC,
      },
    ],
  };
  const chartDataDO = {
    options: {
      dataLabels: {
        enabled: false,
      },
      annotations: {
        yaxis: aleartDO,
      },
      yaxis: {
        min: 1,
        max: 7,
      },
      xaxis: {
        type: "datetime",
      },
      stroke: {
        curve: "smooth",
      },
    },
    series: [
      {
        name: "Series 1",
        data: dataDO,
      },
    ],
  };
  const chartDataTemp = {
    options: {
      dataLabels: {
        enabled: false,
      },
      annotations: {
        yaxis: aleartTemp,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        min: 15,
        max: 35,
      },
      stroke: {
        curve: "smooth",
      },
    },
    series: [
      {
        name: "Series 1",
        data: dataTemp,
      },
    ],
  };

  async function Create() {
    console.log("post USER");
    var dataCreate = await JSON.stringify({
      id: localStorage.getItem("userID"),
      email: localStorage.getItem("userEmail"),
    });
    var configCreate = {
      method: "post",
      url: "http://localhost:4001/users",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreate,
    };

    await axios(configCreate)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        // device = await response.data.schedules;
        setSchedules(response.data.schedules);
        // localStorage.setItem('device',response.data.devices)
      })
      .catch(function (error) {
        console.log(error);
      });
    // console.log(device);
  }

  async function assignVal() {
    var i = 0;
    for (i in schedules) {
      console.log(schedules[i].sensor)
      if (schedules[i].sensor === "ph") {
        arrConfigPH.push({
          y: schedules[i].value,
          strokeDashArray: 8,
          borderColor: "#FF4560",
          label: {
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            textAnchor: "start",
            position: "left",
          },
        })
      }
      if (schedules[i].sensor === "ec") {
        arrConfigEC.push({
          y: schedules[i].value,
          strokeDashArray: 8,
          borderColor: "#FF4560",
          label: {
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            textAnchor: "start",
            position: "left",
          },
        })
      }
      if (schedules[i].sensor === "doxy") {
        arrConfigDO.push({
          y: schedules[i].value,
          strokeDashArray: 8,
          borderColor: "#FF4560",
          label: {
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            textAnchor: "start",
            position: "left",
          },
        })
      }
      if (schedules[i].sensor === "temp") {
        arrConfigTemp.push({
          y: schedules[i].value,
          strokeDashArray: 8,
          borderColor: "#FF4560",
          label: {
            style: {
              color: "#fff",
              background: "#FF4560",
            },
            textAnchor: "start",
            position: "left",
          },
        })
      }
    }
    setAleartPH(arrConfigPH);
    setAleartEC(arrConfigEC);
    setAleartDO(arrConfigDO);
    setAleartTemp(arrConfigTemp);
    setCount(false)
  }

  useEffect(() => {
    const main = async () => {
      data = await get_Data();
      // setData_raw(data)
      // data_prePH, data_preEC = await prepare_data(data);
      // setDatapH(data_prePH)
      data_prePH = await prepare_datapH(data);
      data_preEC = await prepare_dataEC(data);
      data_preDO = await prepare_dataDO(data);
      data_preTemp = await prepare_dataTemp(data);
      // console.log(data_prePH)
      setDatapH(data_prePH);
      setDataEC(data_preEC);
      setDataDO(data_preDO);
      setDataTemp(data_preTemp);
      console.log(localStorage.getItem("device_id"));
      setStatus(true);
    };
    // setTimeout(main(), 5000);
    main();
    Create();
    // schedules
  }, []);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    // const main2 = async () => {
    //   data = await get_Data();
    //   // setData_raw(data)
    //   // data_prePH, data_preEC = await prepare_data(data);
    //   // setDatapH(data_prePH)
    //   data_prePH = await prepare_datapH(data);
    //   data_preEC = await prepare_dataEC(data);
    //   data_preDO = await prepare_dataDO(data);
    //   data_preTemp = await prepare_dataTemp(data);
    //   // console.log(data_prePH)
    //   setDatapH(data_prePH);
    //   setDataEC(data_preEC);
    //   setDataDO(data_preDO);
    //   setDataTemp(data_preTemp);
    //   setData_raw(data);
    //   // console.log('datapH',datapH)
    //   setSeconds(seconds => seconds + 1);
    // };
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  //   setTimeout(() => {
  //     main2();
  //   },  300000);
  // });
  return (
    <div>
      {/* HEADER */}
      {preData ? (
        <>
        {aleartPH.length === 0 && aleartEC.length === 0 && aleartDO.length === 0 && aleartTemp.length === 0 ? (
        console.log('no data')
        ):(
        console.log('got data')
        )}
        </>
      ):(setPreData(false))}
      
      {console.log(schedules,count)}
      {schedules !== "" && count ? (
        (assignVal())
      ) : (
        (console.log("emp"))
      )}
      <nav className="bg-yellow-500 p-2 mt-0 fixed w-full z-10 top-0">
        <div className="container mx-auto flex flex-wrap items-center">
          <div className="flex w-1/2 justify-start text-white font-extrabold">
            <a className="text-white no-underline hover:text-white hover:no-underline">
              <span className="text-2xl pl-2">
                <Link
                  to={{
                    pathname: "/Home",
                  }}
                >
                  <i className="em em-grinning"></i> PRAWNY
                </Link>
              </span>
            </a>
          </div>
          <div className="flex pt-2 content-center w-1/2 justify-end">
            <p className="inline-block text-xl py-2 px-4 text-white no-underline">
              {localStorage.getItem("userName")}
            </p>

            <img
              alt="Placeholder"
              className="block rounded-full w-12 h-12 mr-8"
              src={localStorage.getItem("userPicture")}
            />
            <a
              className="inline-block py-2 px-4 text-white no-underline"
              href="http://localhost:4001"
              // onClick={() => removeLocalStore(this)}
            >
              Logout
            </a>
          </div>
        </div>
      </nav>
      <div className="flex flex-wrap">
        {/* SIDEBAR */}
        <div className="w-20 bg-yellow-500 px-2 text-center fixed bottom-0 pt-8 top-0 left-0 h-16 h-screen border-r-4 border-yellow-300">
          <div className="relative mx-auto float-right">
            <ul className="list-reset flex flex-col text-center mt-16">
              <li className="flex-1 pb-2">
                <Link
                  to={{
                    pathname: "/Home",
                  }}
                >
                  <img
                    src={homeIcon}
                    alt="homeIcon"
                    className="w-3/5 self-center m-auto"
                  />
                  <span className="pb-1 pb-0 text-xs text-white font-bold block">
                    หน้าหลัก
                  </span>
                </Link>
              </li>
              <li className="flex-1 pb-2">
                <Link
                  to={{
                    pathname: "/confignoti",
                  }}
                >
                  <img
                    src={alarmClockIcon}
                    alt="alarmClockIcon"
                    className="w-3/5 self-center m-auto"
                  />
                  <span className="pb-1 text-xs text-gray-500 block">
                    ตั้งค่าการแจ้งเตือน
                  </span>
                </Link>
              </li>
              <li className="flex-1 pb-2">
                <Link
                  to={{
                    pathname: "/Calibrate",
                  }}
                >
                  <img
                    src={wrenchIcon}
                    alt="wrenchIcon"
                    className="w-3/5 self-center m-auto"
                  />
                  <span className="pb-1 text-xs text-gray-500 block">
                    Calibrate
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {status ? (
          <>
            {datapH.length !== 0 ? (
              <>
                <div className="w-11/12 pt-20 pl-60">
                  <div className="flex flex-wrap">
                    {/* column */}
                    <div className="p-1 w-6/12">
                      <article className="overflow-hidden rounded-lg shadow-lg">
                        <div className="flex">
                          <p className="p-4 w-11/12 text-grey-darker text-2xl">
                            กราฟแสดงการอ่านค่าของ pH
                          </p>
                        </div>
                        <div className="flex flex-wrap">
                          <div className="w-8/12">
                            <Chart
                              options={chartDatapH.options}
                              series={chartDatapH.series}
                              type="area"
                              width="100%"
                              height={250}
                            />
                          </div>
                          <div className="w-4/12">
                            <div className="mx-4">
                              <p className="w-full text-sm text-black text-center mt-4">
                                {" "}
                                ค่าปัจจุบัน : {
                                  datapH[datapH.length - 1].y
                                } pH{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <div className="p-1 w-6/12">
                      <article className="overflow-hidden rounded-lg shadow-lg">
                        <div className="flex">
                          <p className="p-4 text-grey-darker text-2xl w-11/12">
                            กราฟแสดงการอ่านค่าของ DO
                          </p>
                        </div>
                        <div className="flex flex-wrap">
                          <div className="w-8/12">
                            <Chart
                              options={chartDataDO.options}
                              series={chartDataDO.series}
                              type="area"
                              width="100%"
                              height={250}
                            />
                          </div>
                          <div className="w-4/12">
                            <div className="mx-4">
                              <p className="w-full text-sm text-black text-center mt-4">
                                {" "}
                                ค่าปัจจุบัน : {
                                  dataDO[dataDO.length - 1].y
                                } mg/L{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <div className="p-1 w-6/12">
                      <article className="overflow-hidden rounded-lg shadow-lg">
                        <div className="flex">
                          <p className="p-4 text-grey-darker text-2xl w-11/12">
                            กราฟแสดงการอ่านค่าของ EC
                          </p>
                        </div>
                        <div className="flex flex-wrap">
                          <div className="w-8/12">
                            <Chart
                              options={chartDataEC.options}
                              series={chartDataEC.series}
                              type="area"
                              width="100%"
                              height={250}
                            />
                          </div>
                          <div className="w-4/12">
                            <div className="mx-4">
                              <p className="w-full text-sm text-black text-center mt-4">
                                {" "}
                                ค่าปัจจุบัน : {dataEC[dataEC.length - 1].y}{" "}
                                ms/cm{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <div className="p-1 w-6/12">
                      <article className="overflow-hidden rounded-lg shadow-lg">
                        <div className="flex">
                          <p className="p-4 text-grey-darker text-2xl w-11/12">
                            กราฟแสดงการอ่านค่าของ Temperature
                          </p>
                        </div>
                        <div className="flex flex-wrap">
                          <div className="w-8/12">
                            <Chart
                              options={chartDataTemp.options}
                              series={chartDataTemp.series}
                              type="area"
                              width="100%"
                              height={250}
                            />
                          </div>
                          <div className="w-4/12">
                            <div className="mx-4">
                              <p className="w-full text-sm text-black text-center mt-4">
                                {" "}
                                ค่าปัจจุบัน : {
                                  dataTemp[dataTemp.length - 1].y
                                }{" "}
                                ℃{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="p-8 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      <p className="text-xl">ไม่พบข้อมูล</p>
                      <button
                        onClick={() =>
                          (window.location.href = "http://localhost:4001/Home")
                        }
                        className="mt-4 ml-1 bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="p-8 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <p className="text-xl">Loading...</p>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )}
      </div>
    </div>
  );
}

export default Graph;
