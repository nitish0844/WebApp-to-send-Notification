import axios from "axios";
import React, { useState } from "react";

const registrationTokens = [
  "d4M6NPvBRY2KU5lUQjXBlI:APA91bFgWGuD3f4KHTQZ2K-GU5iwZSt28XwHNRvuBKly_iMIw7JaNC99OCBCwKoaJ5gRYLsEiDk12tx_S6ZBZVyApVdqXXpi5z_nRdPEmL2Axh6XLikZVsRD9Og5ag1pD5Au8ADrVPxy",
  "fcfC-Z5VSymlXEexfW8TeM:APA91bGLUU26erw7CvFvPN1e78CNofqXNj4hFvPLlolSU0yj_cITjg7srdDawp8VbDs3tWR2wFr_rZHgcxLcFgY1K_Skl4TrlecemHUGvpXepWhzQ64OIDXbuj4JGq8e3HL85MwT_XOZ",
]; // Replace with actual FCM tokens

const notificationPayload = {
  title: "New Offer",
  body: "Check out our latest offer!",
  imageUrl: "https://wallpaperaccess.com/full/393752.jpg",
};

const PushData = async () => {
  const [data, setData] = useState("");
  await axios
    .post(
      "https://us-central1-platform2learn-54f87.cloudfunctions.net/api/send-notification",
      {
        registrationTokens,
        notificationPayload,
      }
    )
    .then((response) => {
      console.log(response.data);
      setData(response.data);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });

  return <div>{data}</div>;
};

export default PushData;
