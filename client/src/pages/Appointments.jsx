import React, { useEffect, useState } from "react";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/user.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const { userId } = jwt_decode(localStorage.getItem("token"));

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(
        `/appointment/getallappointments?search=${userId}`
      );
      setAppointments(temp);
      dispatch(setLoading(false));
    } catch (error) {}
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const complete = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: ele?._id,
            doctorId: ele?.doctorId?._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment marked completed",
          error: "Unable to mark appointment",
          loading: "Updating status...",
        }
      );

      getAllAppoint();
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="container notif-section">
          <h2 className="page-heading">Your Appointments</h2>

          {appointments.length > 0 ? (
            <div className="appointments">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Doctor</th>
                      <th>Patient</th>
                      <th>Appointment Date</th>
                      <th>Appointment Time</th>
                      <th>Booking Date</th>
                      <th>Booking Time</th>
                      <th>Status</th>
                      {userId === appointments[0]?.doctorId?._id && (
                        <th>Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((ele, i) => (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>
                          {ele?.doctorId?.firstname +
                            " " +
                            ele?.doctorId?.lastname}
                        </td>
                        <td>
                          {ele?.userId?.firstname +
                            " " +
                            ele?.userId?.lastname}
                        </td>
                        <td>{ele?.date}</td>
                        <td>{ele?.time}</td>
                        <td>{ele?.createdAt?.split("T")[0]}</td>
                        <td>
                          {ele?.updatedAt?.split("T")[1]?.split(".")[0]}
                        </td>
                        <td>{ele?.status}</td>
                        {userId === ele?.doctorId?._id && (
                          <td>
                            <button
                              className={`btn user-btn accept-btn ${
                                ele?.status === "Completed" ? "disable-btn" : ""
                              }`}
                              disabled={ele?.status === "Completed"}
                              onClick={() => complete(ele)}
                            >
                              Complete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
      <Footer />

      <style>{`
        /* Ensure full height layout */
        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .notif-section {
          flex: 1;
          padding: 1rem 0;
        }

        .appointments {
          width: 100%;
          overflow-x: auto;
        }

        .table-scroll {
          overflow-x: auto;
          width: 100%;
        }

        .table-scroll table {
          min-width: 1000px;
          width: 100%;
          border-collapse: collapse;
        }

        .table-scroll th,
        .table-scroll td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
          white-space: nowrap;
        }

        .table-scroll::-webkit-scrollbar {
          height: 6px;
        }

        .table-scroll::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 8px;
        }

        .table-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        /* Prevent page horizontal scroll */
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default Appointments;
