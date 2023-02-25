import React, { useState, useEffect } from "react";
import axios from "axios";

const RightPanel = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/metrics", {
          headers: { Authorization: "mysecrettoken" },
        });
        setMetrics(response.data);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    const intervalId = setInterval(fetchMetrics, 30000);
    fetchMetrics();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading</div>
      ) : (
        <pre>
          <code>{metrics}</code>
        </pre>
      )}
    </div>
  );
};

export default RightPanel;
