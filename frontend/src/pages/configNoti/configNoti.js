import homeIcon from "../../assets/icon/home-gray.png";
import alarmClockIcon from "../../assets/icon/alarm-clock-white.png";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import wrenchIcon from "../../assets/icon/wrench-gray.png";
import axios from "axios";
import Login from "../Login/Login";

const test = [
  {
    name: "Hello",
    Pond: "ECC-504",
    sensor: "pH",
    condition: "value >",
    value: "9",
    aleart: "pH มีค่าสูงเกินไป",
  },
  {
    name: "Hello",
    Pond: "ECC-504",
    sensor: "pH",
    condition: "value <",
    value: "7",
    aleart: "pH มีค่าต่ำเกินไป",
  },
];
var ttt = '';
// var temp = false;
function ConfigNoti() {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [namePond, setNamePond] = useState("");
  const [sensor, setSensor] = useState("");
  const [condition, setCondition] = useState("");
  const [aleart, setAleart] = useState("");

  const [value, setValue] = useState("");
  const [items] = useState([
    { label: "Select", value: "Select" },
    { label: "ph", value: "ph" },
    { label: "ec", value: "ec" },
    { label: "doxy", value: "doxy" },
    { label: "temp", value: "temp" },
  ]);
  const [valueCon, setValueCon] = useState("");
  const [valueName, setValueName] = useState("");
  const [deviceID, setDeviceID] = useState("");
  const [conditions] = useState([
    { label: "Select", value: "Select" },
    // { label: "time", value: "time" },
    { label: "max", value: "max" },
    { label: "min", value: "min" },
  ]);
  const [device, setDevice] = useState();
  const [temp, setTemp] = useState(false);
  const [status, setStatus] = useState(false);
  const [statusDelete, setStatusDelete] = useState(true);

  const [schedules, setSchedules] = useState();
  async function Create() {
    // console.log("post USER");
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
        // device = await response.data.devices;
        await setDevice(response.data.devices);
        await setSchedules(response.data.schedules);
        // localStorage.setItem('device',response.data.devices)
      })
      .catch(function (error) {
        console.log(error);
      });
    setTemp(true);
  }

  async function createNoti() {
    var dataCreateSchedule = JSON.stringify({
      name_device: deviceID.split(',')[0],
      device_id: valueName.split(',')[1],
      owner_id: localStorage.getItem("userID"),
      // time: new Date().getTime(),
      condition: valueCon,
      sensor: value,
      value: condition,
      msg: aleart,
    });
    console.log(dataCreateSchedule)

    var configCreateNotification = {
      method: "post",
      url: "http://localhost:4001/schedules",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreateSchedule,
    };

    await axios(configCreateNotification)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        // localStorage.setItem('device',response.data.devices)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function deleteNoti(id) {
    setStatusDelete(false);
    var config = {
      method: "delete",
      url: "http://localhost:4001/schedules/" + id,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    setTimeout("location.reload(false);", 100);
    setStatusDelete(true);
  }
  useEffect(() => {
    const main = async () => {
      await Create();
    };
    main();
  }, []);

  // console.log(useLocation());
  return (
    <div>
      {/* HEADER */}
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
              {/* <a
              className="inline-block py-2 px-4 text-white no-underline"
              href="http://localhost:3000"
              // onClick={() => removeLocalStore(this)}
            > */}
              Logout
              {/* </a> */}
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
                  <span className="pb-1 text-xs text-white block">
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
        {/* CARD */}
        <div className="w-full pt-24">
          {/* column */}
          <div className="w-4/5 mx-auto">
            <p className="text-lg font-bold"> รายการแจ้งเตือน </p>
            <div className="bg-white shadow-md rounded my-6">
              <table className="text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      ชื่อบ่อเลี้ยง
                    </th>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      sensor
                    </th>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      เงื่อนไข
                    </th>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      value
                    </th>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      ข้อความแจ้งเตือน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {temp && statusDelete ? (
                    <>
                      {schedules.map((object) => (
                        <tr className="hover:bg-grey-lighter">
                          <td className="py-4 px-4 bg-gray-50 border border-gray-300">
                            {object.name_device}
                          </td>
                          <td className="py-4 px-4 bg-gray-50 border border-gray-300">
                            {object.sensor}
                          </td>
                          <td className="py-4 px-4 bg-gray-50 border border-gray-300">
                            {object.condition}
                          </td>
                          <td className="py-4 px-4 bg-gray-50 border border-gray-300">
                            {object.value}
                          </td>
                          <td className="py-4 px-4 bg-gray-50 border border-gray-300">
                            <div className="flex">
                              <div className="w-10/12">
                                <p>{object.msg}</p>
                              </div>
                              <button
                                onClick={() => {
                                  deleteNoti(object.id);
                                }}
                              >
                                <p className="text-gray-300 hover:underline hover:text-gray-400">
                                  {" "}
                                  delete{" "}
                                </p>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                </tbody>
              </table>
            </div>
            <p className="pt-12 text-lg font-bold">เพิ่มรายการแจ้งเตือน</p>
            <div className="bg-white shadow-md rounded my-6">
              <table className="table-fixed text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      ชื่อบ่อเลี้ยง
                    </th>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      sensor
                    </th>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      เงื่อนไข
                    </th>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      value
                    </th>
                    <th className="py-4 px-4 bg-gray-200 font-bold uppercase text-sm text-grey-dark border border-gray-300">
                      ข้อความแจ้งเตือน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-grey-lighter">
                    <td className="py-4 px-4  bg-gray-50 border border-gray-300">
                      {/* <input
                        type="text"
                        className="py-1 overflow-hidden rounded shadow"
                      ></input> */}
                      <div className="relative inline-flex">
                        {temp ? (
                          <>
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
                                setDeviceID(e.currentTarget.value);
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
                    </td>
                    <td className="py-4 px-4  bg-gray-50 border border-gray-300">
                      <div className="relative inline-flex">
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
                        {/* <select className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                          <option onChange={() => console.log('ph')}>pH</option>
                          <option >EC</option>
                          <option>DO</option>
                          <option>Temperature</option>
                        </select> */}
                        <select
                          value={value}
                          onChange={(e) => setValue(e.currentTarget.value)}
                          className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
                        >
                          {items.map(({ label, value }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-4  bg-gray-50 border border-gray-300">
                      <div className="relative inline-flex">
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
                          value={valueCon}
                          onChange={(e) => setValueCon(e.currentTarget.value)}
                          className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
                        >
                          {conditions.map(({ label, value }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-4  bg-gray-50 border border-gray-300">
                      {/* <input
                        type="text"
                        className="py-1 overflow-hidden rounded shadow"
                      ></input> */}
                      {valueCon === "time" ? (
                        <>
                          <input
                            type="time"
                            className="py-1 overflow-hidden rounded shadow"
                            onChange={(e) =>
                              setCondition(e.currentTarget.value)
                            }
                          ></input>
                        </>
                      ) : (
                        <>
                          {/* {console.log(valueCon)} */}
                          <input
                            type="number"
                            className="py-1 overflow-hidden rounded shadow"
                            onChange={(e) =>
                              setCondition(e.currentTarget.value)
                            }
                          ></input>
                        </>
                      )}
                    </td>
                    <td className="py-4 px-4 bg-gray-50 border border-gray-300">
                      <input
                        type="text"
                        className="py-1 overflow-hidden rounded shadow"
                        onChange={(e) => setAleart(e.currentTarget.value)}
                      ></input>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="inline-block mr-2 mt-2">
              {valueName === "" ||
              condition === "" ||
              valueCon === "" ||
              aleart === "" ||
              valueName === "Select" ||
              condition === "Select" ||
              valueCon === "Select" ? (
                <>
                  <button
                    type="button"
                    className="px-8 py-4  text-white text-sm rounded-md bg-red-500 opacity-50"
                    onClick={() => createNoti()}
                    disabled
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="px-8 py-4 focus:outline-none text-white text-sm rounded-md bg-red-500 hover:bg-red-600 hover:shadow-lg"
                    onClick={() => {
                      createNoti();
                      setTimeout("location.reload(false);", 200);
                    }}
                  >
                    Save
                  </button>
                </>
              )}

              <button
                type="button"
                className="px-8 py-4 ml-8 focus:outline-none text-red-600 text-sm rounded-md border border-red-600 hover:bg-red-50"
              >
                Cancel
              </button>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default ConfigNoti;
