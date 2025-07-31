import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/notification.css";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import "../styles/user.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/notification/getallnotifs`);
      dispatch(setLoading(false));
      setNotifications(temp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllNotif();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {loading ? (
          <Loading />
        ) : (
          <section className="container notif-section">
            <h2 className="page-heading">Your Notifications</h2>

            {notifications.length > 0 ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Content</th>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications?.map((ele, i) => (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>{ele?.content}</td>
                        <td>{ele?.updatedAt.split("T")[0]}</td>
                        <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty />
            )}
          </section>
        )}
      </div>
      <Footer />

      {/* Inline CSS for page layout and scrollable table */}
      <style>{`
        .page-wrapper {
          min-height: calc(100vh - 120px); /* Adjust height based on Navbar + Footer */
          display: flex;
          flex-direction: column;
        }

        .notif-section {
          flex: 1;
          padding-bottom: 20px;
        }

        .table-scroll {
          overflow-x: auto;
          width: 100%;
        }

        table {
          width: 100%;
          min-width: 600px;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px 16px;
          border: 1px solid #ddd;
          text-align: left;
        }

        th {
          background-color: #f8f8f8;
        }
      `}</style>
    </>
  );
};

export default Notifications;
