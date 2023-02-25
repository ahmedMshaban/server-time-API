import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const LeftPanel = () => {
  const [serverTime, setServerTime] = useState(0);
  const [clientTime, setClientTime] = useState(Date.now() / 1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServerTime = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/time", {
          headers: { Authorization: "mysecrettoken" },
        });
        setServerTime(response.data.epoch);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    const intervalId = setInterval(fetchServerTime, 30000);
    fetchServerTime();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setClientTime(Date.now() / 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const timeDiff = moment
    .utc(moment.unix(clientTime).diff(moment.unix(serverTime)))
    .format("HH:mm:ss");

  return (
    <div>
      {loading ? (
        <div>Loading</div>
      ) : (
        <>
          <div>Server Time: {serverTime}</div>
          <div>Time Difference: {timeDiff}</div>
        </>
      )}
    </div>
  );
};

export default LeftPanel;
