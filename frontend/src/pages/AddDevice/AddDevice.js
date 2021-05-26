import homeIcon from "../../assets/icon/home-gray.png";
import alarmClockIcon from "../../assets/icon/alarm-clock-white.png";
import wrenchIcon from "../../assets/icon/wrench-gray.png";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
function AddDevice() {
  const [MACAddr, setMACAddr] = useState("");
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
        <div className="w-11/12 pl-40 pt-24">
          {/* column */}
          <form>
            <div className="p-4 w-6/12">
              <article className="overflow-hidden rounded-lg shadow-lg pb-4">
                <p className="p-4"> Insert MAC address to connect </p>
                <label className="px-4 m-auto">
                  MAC Address :
                  <input
                    type="text"
                    name="Interval"
                    onChange={(e) => setMACAddr(e.target.value)}
                    required
                    className="overflow-hidden rounded-lg shadow ml-2"
                  />
                </label>
              </article>
            </div>
            <input
              className="bg-green-500 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded ml-8"
              type="submit"
              value="Connect"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDevice;
