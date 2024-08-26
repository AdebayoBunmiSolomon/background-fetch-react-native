import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { useNotifications } from "./useNotifications";
import { sendBgNotification, sendNotification } from "./helper";

const BACKGROUND_FETCH_TASK = "background-fetch";
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );

  try {
    // Function to run in background
    await sendBgNotification();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error in background fetch task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 60, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

export default function App() {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState<any>(null);
  const { expoPushToken } = useNotifications();

  React.useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  useEffect(() => {
    if (expoPushToken) {
      console.log(expoPushToken);
    }
  }, [expoPushToken]);

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background action status:{" "}
          <Text style={styles.boldText}>
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </Text>
        </Text>
        <Text>
          Background action task name:{" "}
          <Text style={styles.boldText}>
            {isRegistered ? BACKGROUND_FETCH_TASK : "Not registered yet!"}
          </Text>
        </Text>
      </View>
      <View style={styles.textContainer}></View>
      <Button
        title={"Check background action is registered"}
        onPress={checkStatusAsync}
      />
      <Button
        title={"Send Push Notification"}
        onPress={async () => sendNotification()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
});
