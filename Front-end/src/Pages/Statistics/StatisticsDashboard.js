import React from "react";
import Header from "../../Components/Header";

export const StatisticsDashboard = () => {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <iframe
          title="Looker Report"
          width="100%"
          height="100%"
          src="https://lookerstudio.google.com/embed/reporting/90b0e0ff-97f1-45be-b819-eba7b7d6e759/page/4KLYD"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};
