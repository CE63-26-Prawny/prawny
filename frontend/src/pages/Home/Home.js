import homeIcon from "../../assets/icon/home.png";
import alarmClockIcon from "../../assets/icon/alarm-clock-gray.png";
import wrenchIcon from "../../assets/icon/wrench-gray.png";
import plus from "../../assets/icon/plus.png";
import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { createRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("code");
var arr = [];
var qs = require("qs");

var data = qs.stringify({
  grant_type: "authorization_code",
  code: myParam,
  redirect_uri: "http://localhost:3000/Home",
  client_id: "1655743694",
  client_secret: "30bc0843c7433f660f5606915a03c4e3",
});
var config = {
  method: "post",
  url: "https://api.line.me/oauth2/v2.1/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: data,
};
var status = "",
  res = "",
  temp = "",
  count = false,
  id_token = "",
  userName = "",
  userPicture = "",
  userID = "",
  userEmail = "",
  info_decode = "",
  decode_info = "";
// dataCreate = "";

var device = "";
const defaultData = {
  time: "ไม่มีข้อมล",
  device_id: "ไม่มีข้อมล",
  temperature: "ไม่มีข้อมล",
  ph: "ไม่มีข้อมล",
  doxy: "ไม่มีข้อมล",
  ec: "ไม่มีข้อมล",
};

class Upload extends React.Component {
  state = {
    file: null,
    base64URL: "",
    url: "",
  };

  getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        // console.log("Called", reader);
        baseURL = reader.result;
        // console.log('b64',baseURL);
        localStorage.setItem("pic_b64", baseURL);
        resolve(baseURL);
      };
    });
  };
  handleFileInputChange = (e) => {
    // console.log(e.target.files[0]);
    let { file } = this.state;

    file = e.target.files[0];

    this.getBase64(file)
      .then((result) => {
        file["base64"] = result;
        // console.log("File Is", file);
        this.setState({
          base64URL: result,
          file,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  render() {
    return (
      <div>
        <label class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
          <svg
            class="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span class="mt-2 text-base leading-normal">Select a picture</span>
          <input
            type="file"
            class="hidden"
            onChange={(this.handleChange, this.handleFileInputChange)}
          />
          <img className="border" required src={this.state.url} />
        </label>
      </div>
    );
  }
}
// class Article extends React.Component {
//   state = {
//     ph:'',
//     ec:'',
//     do:'',
//     temp:'',
//   };

//   render() {
//     return (
//       <div className="flex flex-wrap">
//         {deviceSize.length !== 0 ? (
//           <>
//           {console.log(deviceSize)}
//           </>
//         ) : null}
//       </div>
//     );
//   }
// }

function Home() {
  const [state, setState] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal_2, setShowModal_2] = useState(false);
  const [nameInfo, setNameInfo] = useState("");
  const [deviceID, setDeviceID] = useState("");
  const [picInfo, setPicInfo] = useState("");
  const [status, setStatus] = useState("");
  const [deviceSize, setDeviceSize] = useState("");
  const [card, setCard] = useState("");
  const [checkpoint, setCheckPoint] = useState(true);
  async function test() {
    await axios(config)
      .then(async function (response) {
        // console.log(response.data.id_token);
        temp = await response.data.id_token;
      })
      .catch(function (error) {
        console.log(error);
      });
    return temp;
  }


  async function decode(token) {
    decode_info = await jwt_decode(token);
    return decode_info;
  }

  async function Connect() {
    console.log("Connect!!");
    var configConnect = {
      method: "get",
      url: "http://157.230.35.129:8000/connection/" + deviceID,
      headers: {},
    };

    await axios(configConnect)
      .then(function (response) {
        console.log(JSON.stringify(response.status));
        setStatus(response.status);
      })

      .catch(function (error) {
        console.log(error);
      });
    // setStatus(200)
  }
  // user
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
        device = await response.data.devices;
        setDeviceSize(response.data.devices);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // device
  async function CreateDevice() {

    var dataCreateDevice = JSON.stringify({
      device_id: deviceID,
      owner_id: localStorage.getItem("userID"),
      name: nameInfo,
      image: localStorage.getItem("pic_b64"),
    });
    var configCreateDevice = {
      method: "post",
      url: "http://157.230.35.129:8000/devices",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: dataCreateDevice,
    };

    await axios(configCreateDevice)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function resDataOne(deviceIn) {
    var configResDataOne = {
      method: "get",
      url: "http://157.230.35.129:8000/dataone/" + deviceIn,
      headers: {},
    };

    await axios(configResDataOne)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log(JSON.stringify(response));
        setCard(response.data);
        setCheckPoint(false);
        return response.data;
      })

      .catch(function (error) {
        console.log(error);
      });
    setCheckPoint(false);
  }
  // const [x, setX] = useState(true)
  // async function assignArr() {
  //   if(arr.length !== 0){
  //     for(const i in arr){
  //       if (arr[i].device_id !== card.device_id){
  //       arr.push(card)
  //       console.log('1',card)
  //       }
  //     }
  //   }
  //   else{
  //     arr.push(card)
  //     console.log('2',card)
  //   }
  //   // console.log('arr',arr)
  // }
  useEffect(() => {
    const main = async () => {
      if (localStorage.getItem("userName") === null) {
        id_token = await test();
        info_decode = await decode(id_token);

        userName = info_decode.name;
        userID = info_decode.sub;
        userPicture = info_decode.picture;
        userEmail = info_decode.email;
        localStorage.setItem("userName", userName);
        localStorage.setItem("userID", userID);
        localStorage.setItem("userPicture", userPicture);
        localStorage.setItem("userEmail", userEmail);
      }
      Create();
      setState(true);
    };
    main();
  }, []);

  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {console.log("1 min")}
      {state ? (
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
            <div className="w-11/12 pl-40 pt-24">
              <div className="flex flex-wrap">
                {/* column */}
                {deviceSize.length !== 0 ? (
                  <>
                    {deviceSize.map((object) => (
                      <Link
                        to={{
                          pathname: "/graph",
                        }}
                        className="p-4 w-6/12"
                      >
                        <div>
                          <article
                            className="overflow-hidden shadow-lg  rounded-lg"
                            onClick={() => {
                              localStorage.setItem(
                                "device_id",
                                object.device_id
                              );
                              setTimeout("location.reload(false);");
                            }}
                          >
                            <div className="flex flex-wrap">
                              <div className="w-7/12">
                                <figure className="relative max-w-xs cursor-pointer">
                                  <img
                                    alt="Placeholder"
                                    className="block"
                                    src={object.image}
                                    style={{ height: "220px", width: "400px" }}
                                  />
                                  <figcaption className="absolute text-lg text-white -mt-56 w-full">
                                    <div className="overflow-hidden bg-black p-2.5 bg-opacity-50">
                                      <p className="opacity-100 white">
                                        {object.name}
                                      </p>
                                    </div>
                                  </figcaption>
                                </figure>
                              </div>
                              <div className="w-5/12 p-4">
                                {checkpoint
                                  ? (resDataOne(object.device_id),
                                    setCheckPoint(false))
                                  : null}
                                {card.device_id === object.device_id ? (
                                  <>
                                  {/* {console.log('xxx',arr)} */}
                                    <div className="ml-2 text-sm font-bold">
                                      <div className="text-yellow-500 flex flex-wrap pt-4">
                                        <p className="w-3/12 justify-start ">
                                          PH
                                        </p>
                                        <p className="w-5/12 text-black justify-between">
                                          : {card.ph}
                                        </p>
                                        <p className="w-3/12 text-gray-500 justify-end">
                                          {" "}
                                          pH
                                        </p>
                                      </div>
                                      <div className="text-yellow-500 flex flex-wrap pt-4">
                                        <p className="w-3/12 justify-start ">
                                          DO
                                        </p>
                                        <p className="w-5/12 text-black justify-between">
                                          : {card.doxy}
                                        </p>
                                        <p className="w-3/12 text-gray-500 justify-end">
                                          {" "}
                                          mg/L
                                        </p>
                                      </div>
                                      <div className="text-yellow-500 flex flex-wrap pt-4">
                                        <p className="w-3/12 justify-start ">
                                          EC
                                        </p>
                                        <p className="w-5/12 text-black justify-between">
                                          : {card.ec}
                                        </p>
                                        <p className="w-3/12 text-gray-500 justify-end">
                                          {" "}
                                          ms/cm
                                        </p>
                                      </div>
                                      <div className="text-yellow-500 flex flex-wrap pt-4">
                                        <p className="w-3/12 justify-start ">
                                          Temp
                                        </p>
                                        <p className="w-5/12 text-black justify-between">
                                          : {card.temperature}
                                        </p>
                                        <p className="w-3/12 text-gray-500 justify-end">
                                          {" "}
                                          ℃
                                        </p>
                                      </div>
                                      {/* <p className="text-red-300 hover:underline hover:text-red-400 pt-6 relative mx-auto float-right">delete</p> */}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div class="text-xl pt-20 text-center">
                                      รอการอัพเดตข้อมูล
                                    </div>
                                    {/* <p className="text-sm font-bold text-red-300 hover:underline hover:text-red-400 pt-16 relative mx-auto float-right">delete</p> */}
                                    {/* {setTimeout()} */}
                                  </>
                                )}
                              </div>
                            </div>
                          </article>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : 
                null}
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 right-0 p-4 w-1/12">
            <button onClick={() => setShowModal(true)}>
              <img
                alt="Placeholder"
                className="block rounded-full ml-4 w-8/12"
                src={plus}
              />
            </button>
          </div>
          {showModal ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        ข้อมูลบ่อเลี้ยง
                      </h3>
                    </div>
                    {/*body*/}
                    <div className="p-6">
                      <div className="p-4 w-full">
                        <label>
                          ชื่อ :
                          <input
                            type="text"
                            name="nameInfo"
                            onChange={(e) => setNameInfo(e.target.value)}
                            required
                            className="overflow-hidden rounded-lg shadow ml-2 p-1"
                          />
                        </label>
                      </div>
                      <div className="p-4">
                        <Upload></Upload>
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setShowModal_2(true);
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
          {showModal_2 ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        เชื่อมต่ออุปกรณ์
                      </h3>
                    </div>
                    {/*body*/}
                    <div className="p-6">
                      <div className="p-4 w-full">
                        <label>
                          Device ID :
                          <input
                            type="text"
                            name="nameInfo"
                            onChange={(e) => setDeviceID(e.target.value)}
                            required
                            className="overflow-hidden rounded-lg shadow ml-2 p-1"
                          />
                        </label>
                        <button
                          className="ml-4 bg-yellow-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => {
                            Connect();
                          }}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal_2(false)}
                      >
                        Close
                      </button>
                      {status === 200 ? (
                        <>
                          <button
                            className="bg-green-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => {
                              setShowModal_2(false);
                              CreateDevice();
                              setTimeout("location.reload(false);", 200);
                            }}
                          >
                            Done
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="opacity-25 bg-green-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            disabled
                            onClick={() => setShowModal_2(false)}
                          >
                            Done
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
        </div>
      ) : (
        console.log("hello")
      )}
    </div>
  );
}

export default Home;
