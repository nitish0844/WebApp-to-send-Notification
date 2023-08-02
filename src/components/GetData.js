/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import styles from "./Style.module.css"; // Import the CSS module
import axios from "axios";
// import "firebase/storage";
import { Storage_Bucket } from "./Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db } from "./Firebase";
import { collection, getDocs } from "firebase/firestore";

const GetData = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [fcmToken, getFcmToken] = useState("");
  const [registrationTokens, setRegistrationTokens] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Use FileReader to read the selected image file
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);

        // Upload the selected image to Firebase Storage
        const storageRef = ref(Storage_Bucket, `images/${Date.now()}`);
        setLoading(true);
        uploadString(storageRef, reader.result, "data_url") // Use uploadString instead of putString
          .then((snapshot) => {
            console.log("Image uploaded successfully!");

            // Get the image URL from Firebase Storage
            getDownloadURL(snapshot.ref).then((url) => {
              console.log("Image URL:", url);
              setImageUrl(url);
              setLoading(false);
            });
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            setLoading(false);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendNotification = () => {
    if (selectedImage && title && body && registrationTokens.length > 0) {
      // Send the selected image data to the API
      axios
        .post(
          "https://us-central1-platform2learn-54f87.cloudfunctions.net/api/send-notification",
          {
            registrationTokens: registrationTokens,
            notificationPayload: {
              title: title,
              body: body,
              imageUrl: imageUrl,
            },
          }
        )
        .then((response) => {
          // Handle the API response if needed
          console.log("API response:", response.data);
        })
        .catch((error) => {
          // Handle any errors that occurred during the API request
          console.error("API request error:", error);
        });
    }
  };

  const userCollectedRef = collection(db, "UserFcmToken");

  const getUser = async () => {
    try {
      const querySnapshot = await getDocs(userCollectedRef);
      const tokens = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fcmToken = data.FcmToken;
        tokens.push(fcmToken);
      });

      // Set the FCM tokens in the state
      setRegistrationTokens(tokens);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log(registrationTokens);

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter the Title"
          style={{ width: "100%", height: "100%", textAlign: "center" }}
        />
      </div>

      <div className={styles.container}>
        <input
          type="text"
          value={body}
          onChange={handleBodyChange}
          placeholder="Enter the description"
          style={{ width: "100%", height: "100%", textAlign: "center" }}
        />
      </div>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {imageUrl ? (
        <div>
          {loading ? (
            <p>Loading image...</p>
          ) : (
            <>
              <h3>Selected Image:</h3>
              <img
                src={imageUrl}
                alt="Selected"
                style={{ width: "300px", height: "auto" }}
              />
            </>
          )}
        </div>
      ) : null}
      <button
        className={styles.Button}
        onClick={handleSendNotification}
        name="Send Notification"
      >
        Send Notification
      </button>
    </div>
  );
};

export default GetData;
