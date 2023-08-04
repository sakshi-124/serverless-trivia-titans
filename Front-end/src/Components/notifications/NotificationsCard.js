export const NotificationCard = ({ notification }) => {
  console.log("not", notification);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ marginRight: "1rem" }}>{notification.data.details}</p>
        <p>{notification.datetime}</p>
      </div>
    </div>
  );
};
