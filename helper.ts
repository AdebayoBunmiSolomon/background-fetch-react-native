import { Platform } from "react-native";
import { NotificationControl } from "./useNotifications";
export const sendNotification = async () => {
  // Calculate the time interval in seconds until the next 7:05 PM
  const now = new Date();
  const target = new Date();
  target.setHours(19, 11, 0, 0); // Set target to 7:05 PM today

  // If the target time has already passed today, set for tomorrow
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  // Calculate the difference in seconds
  const secondsUntilTarget = Math.round(
    (target.getTime() - now.getTime()) / 1000
  );
  try {
    await NotificationControl.scheduleNotificationAsync({
      content: {
        title: "Good Evening!",
        body: "This is your evening reminder!",
      },
      trigger:
        Platform.OS === "android"
          ? {
              seconds: secondsUntilTarget,
              repeats: false, // Does not repeat
            }
          : {
              hour: 19,
              minute: 5,
              repeats: false, // Does not repeat
            },
    });

    console.log("Notification scheduled successfully!");
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
};
