import homeIcon from "../../assets/icon/home-gray.png";
import alarmClockIcon from "../../assets/icon/alarm-clock-gray.png";
import wrenchIcon from "../../assets/icon/wrench-white.png";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Calibrate() {
  const [pHKind, setpHKind] = useState("");
  const [pHDrop] = useState([
    { label: 4, value: 4 },
    { label: 7, value: 7 },
  ]);
  const [pHValue, setpHValue] = useState("");
  const [pHStatus, setpHStatus] = useState(false);
  const [pHStore, setpHStore] = useState("");

  const [ECValue, setECValue] = useState("");
  const [ECStatus, setECStatus] = useState("");
  const [ECStore, setECStore] = useState("");

  const [DOValue, setDOValue] = useState("");
  const [DOStatus, setDOStatus] = useState("");
  const [DOStore, setDOStore] = useState("");

  const [device, setDevice] = useState();
  // const [deviceID, setDeviceID] = useState();
  const [valueName, setValueName] = useState();
  async function Create() {
    console.log("post USER");
    var dataCreate = await JSON.stringify({
      id: localStorage.getItem("userID"),
      email: localStorage.getItem("userEmail"),
    });
    var configCreate = {
      method: "post",
      url: "http://157.230.35.129:8000/users",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreate,
    };

    await axios(configCreate)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        // device = await response.data.devices;
        await setDevice(response.data.devices);
        // localStorage.setItem('device',response.data.devices)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function pH() {
    let temp = 'phMin'
    if(pHKind === '7')  temp ='phMax'
    // console.log(temp)
    // console.log(valueName.split(',')[1])
    var dataCreate = await JSON.stringify({
      // device_id: valueName.split(',')[1],
      device_id: "8CAAB594F540",
      sensor: temp,
    });
    console.log(dataCreate)
    var configMeasure = {
      method: "post",
      url: "http://157.230.35.129:8000/measurement",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreate,
    };
    await axios(configMeasure)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        setpHValue(response.data.value)
        // setpHStatus(true)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function EC() {
    // console.log(valueName)
    // console.log("EC");
    var dataCreate = await JSON.stringify({
      // device_id: valueName.split(',')[1],
      device_id: "8CAAB594F540",
      sensor: "ec",
    });
    var configMeasure = {
      method: "post",
      url: "http://157.230.35.129:8000/measurement",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreate,
    };
    await axios(configMeasure)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        setECValue(response.data.value)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function DO() {
    // console.log(valueName)
    // console.log("DO");
    var dataCreate = await JSON.stringify({
      // device_id: valueName.split(',')[1],
      device_id: "8CAAB594F540",
      sensor: 'do',
    });
    var configMeasure = {
      method: "post",
      url: "http://157.230.35.129:8000/measurement",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreate,
    };
    await axios(configMeasure)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        setDOValue(response.value)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function pH_Calib() {
    let temp = 'phMin'
    if(pHKind === '7')  temp ='phMax'
    // console.log(temp)
    // console.log(valueName.split(',')[1])
    var dataCreate = await JSON.stringify({
      // device_id: valueName.split(',')[1],
      device_id: "8CAAB594F540",
      sensor: temp,
    });
    console.log(dataCreate)
    var configMeasure = {
      method: "post",
      url: "http://157.230.35.129:8000/calibate",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreate,
    };
    await axios(configMeasure)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        setpHStore(response.data.store)
        // setpHStatus(true)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function DO_Calib() {
    // console.log(temp)
    // console.log(valueName.split(',')[1])
    var dataCreate = await JSON.stringify({
      // device_id: valueName.split(',')[1],
      device_id: "8CAAB594F540",
      sensor: 'do',
    });
    console.log(dataCreate)
    var configMeasure = {
      method: "post",
      url: "http://157.230.35.129:8000/calibate",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreate,
    };
    await axios(configMeasure)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        setDOStore(response.data.store)
        // setpHStatus(true)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function EC_Calib() {
    // console.log(temp)
    // console.log(valueName.split(',')[1])
    var dataCreate = await JSON.stringify({
      // device_id: valueName.split(',')[1],
      device_id: "8CAAB594F540",
      sensor: 'ec',
    });
    console.log(dataCreate)
    var configMeasure = {
      method: "post",
      url: "http://157.230.35.129:8000/calibate",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreate,
    };
    await axios(configMeasure)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        setECStore(response.data.store)
        // setpHStatus(true)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    const main = async () => {
      await Create();
    };
    main();
  }, []);
  return (
    <div>
      <div>
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
              <Link
                to={{
                  pathname: "/",
                }}
                className="inline-block py-2 px-4 text-white no-underline"
              >
                Logout
              </Link>
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
                    <span className="pb-1 pb-0 text-xs text-gray-500 font-bold block">
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
                    <span className="pb-1 text-xs text-white block">
                      Calibrate
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* CARD */}

          {Array.isArray(device) ? (
            <>
              {/* {console.log(device.length)} */}
              {/* {console.log(valueName)} */}
              <div className="w-11/12 pl-40 pt-20">
                <div className="flex flex-wrap">
                  <p className="text-3xl font-semibold pl-16">
                    Calibrate Sensor
                  </p>
                  <div className="relative pl-12 inline-flex">
                    <svg
                      className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 412 232"
                    >
                      <path
                        d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                        fill="#648299"
                        fillRule="nonzero"
                      />
                    </svg>
                    <select
                      value={valueName}
                      onChange={(e) => {
                        setValueName(e.currentTarget.value);
                      }}
                      className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
                    >
                      <option key="Select" value="Select">
                        Select
                      </option>
                      {device.map((object) => (
                        // <option key={object.name} value='{"name":object.name,"deviceid":object.device_id}'>
                        <option
                          key={object.name}
                          value={[object.name, object.device_id]}
                        >
                          {object.name}
                          {/* {console.log(object.device_id)} */}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-11/12 pl-12">
                    {/* column */}
                    <div className="pt-2">
                      <article className="overflow-hidden shadow-lg rounded-lg p-4 w-11/12">
                        <div className="w-max">
                          <p className="p-4 underline">pH Sensor</p>
                          <div className="relative pl-4 inline-flex">
                            <div className="flex">
                              <div className="pt-2 pr-4">Calibrate at pH </div>
                              <div>
                                <svg
                                  className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 412 232"
                                >
                                  <path
                                    d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                                    fill="#648299"
                                    fillRule="nonzero"
                                  />
                                </svg>
                                <select
                                  value={pHKind}
                                  onChange={(e) => {
                                    setpHKind(e.currentTarget.value);
                                    console.log(pHKind);
                                  }}
                                  className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
                                >
                                  <option key="Select" value="Select">
                                    Select
                                  </option>
                                  {pHDrop.map((object) => (
                                    // <option key={object.name} value='{"name":object.name,"deviceid":object.device_id}'>
                                    <option
                                      key={object.value}
                                      value={object.value}
                                    >
                                      {object.value}
                                      {/* {console.log(object.device_id)} */}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <p className="p-4">
                            {pHValue !== ""? (
                              <>Current pH : {pHValue}</>
                            ) : (
                              <>Current pH : ...</>
                            )}
                            {pHStore !== ""? (
                              <>&emsp;&emsp; &emsp;&emsp; &emsp;&emsp; store : {pHStore}</>
                            ) : (
                              <>&emsp;&emsp; &emsp;&emsp; &emsp;&emsp; store : ...</>
                            )}
                          </p>
                        </div>
                        <div className="flex">
                          {pHKind !== "" ? (
                            <>
                              <button
                                onClick={() => pH()}
                                className="ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md"
                              >
                                measurement
                              </button>
                              <button
                              onClick={() => pH_Calib()} 
                              className="ml-12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">
                                calibrate
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => pH()}
                                disabled
                                className="opacity-50 ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md"
                              >
                                measurement
                              </button>
                              <button 
                              disabled
                              onClick={() => pH_Calib()} 
                              className="opacity-50 ml-12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">
                                calibrate
                              </button>
                            </>
                          )}
                        </div>
                      </article>
                    </div>
                    <div className="pt-2">
                      <article className="overflow-hidden shadow-lg rounded-lg p-4 w-11/12">
                        <div className="w-max">
                          <p className="p-4 underline">EC Sensor</p>
                          <p className="p-4">
                            {ECValue !== "" ? (
                              <>Current EC : {ECValue}</>
                            ) : (
                              <>Current EC : ...</>
                            )}
                            {ECStore !== ""? (
                              <>&emsp;&emsp; &emsp;&emsp; &emsp;&emsp; store : {ECStore}</>
                            ) : (
                              <>&emsp;&emsp; &emsp;&emsp; &emsp;&emsp; store : ...</>
                            )}
                          </p>
                        </div>
                        <div className="flex">
                          <button
                            onClick={() => EC()}
                            className="ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md"
                          >
                            measurement
                          </button>
                          <button
                          onClick={() => EC_Calib()} 
                          className="ml-12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">
                            calibrate
                          </button>
                        </div>
                      </article>
                    </div>
                    <div className="pt-2">
                      <article className="overflow-hidden shadow-lg rounded-lg p-4 w-11/12">
                        <div className="w-max">
                          <p className="p-4 underline">DO Sensor</p>
                          <p className="p-4">
                            {DOValue !== "" ? (
                              <>Current DO : {DOValue}</>
                            ) : (
                              <>Current DO : ...</>
                            )}
                            {DOStore !== ""? (
                              <>&emsp;&emsp; &emsp;&emsp; &emsp;&emsp; store : {DOStore}</>
                            ) : (
                              <>&emsp;&emsp; &emsp;&emsp; &emsp;&emsp; store : ...</>
                            )}
                          </p>
                        </div>
                        <div className="flex">
                          <button
                            onClick={() => DO()}
                            className="ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md"
                          >
                            measurement
                          </button>
                          <button
                          onClick={() => DO_Calib()} 
                          className="ml-12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">
                            calibrate
                          </button>
                        </div>
                      </article>
                    </div>
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
                    <p className="text-xl">Loading...</p>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calibrate;
