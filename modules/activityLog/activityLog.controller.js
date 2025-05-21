import axios from "axios";
import AdmZip from "adm-zip";
import zlib from "zlib";

const API_KEY = "839863856690d923b854dc4053b48e3";
const SECRET_KEY = "b03f57695602800073060b95b8ebb25";

export const getactivityLogController = async (req, res) => {
  console.log("inside activityLog controller");

  const userId = req.user?.id;
  const start = "20250513T00";
  const end = "20250513T23";
  // const start = new Date("2025-05-12T00");
  // const end = new Date("2025-05-13T23");

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: missing user ID" });
  }

  try {
    const url = `https://amplitude.com/api/2/export?start=${start}&end=${end}`;
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      auth: {
        username: API_KEY,
        password: SECRET_KEY,
      },
    });

    const zip = new AdmZip(response.data);
    const entries = zip.getEntries();
    const dailyTotals = {
      AppUsage: {},
      SpellingGame: {},
      PhonicsGame: {},
    };

    console.log(entries.map((e) => e.entryName));

    entries.forEach((entry) => {
      const compressedBuffer = entry.getData();

      let decompressed;
      try {
        decompressed = zlib.gunzipSync(compressedBuffer);
      } catch (decompressErr) {
        console.warn("Skipping entry, failed to decompress:", entry.entryName);
        return;
      }

      const lines = decompressed.toString("utf8").split("\n");

      for (let line of lines) {
        if (!line.trim()) continue;

        let event;
        try {
          event = JSON.parse(line);
        } catch (e) {
          console.warn("Skipping invalid JSON line:", line.slice(0, 100));
          continue;
        }

        const rawTimestamp = event.event_time;
        if (!rawTimestamp || isNaN(new Date(rawTimestamp).getTime())) {
          console.warn("Skipping event with invalid timestamp:", rawTimestamp);
          continue;
        }

        const eventDate = new Date(rawTimestamp).toISOString().split("T")[0];
        // console.log(eventDate);

        if (
          event.event_type === "App Usage" &&
          event.user_id === userId &&
          event.event_properties &&
          typeof event.event_properties.time_spent_seconds === "number"
        ) {
          const eventDate =
            event.event_properties.date ||
            new Date(event.event_time).toISOString().split("T")[0];

          if (!dailyTotals.AppUsage[eventDate]) {
            dailyTotals.AppUsage[eventDate] = 0;
          }

          dailyTotals.AppUsage[eventDate] +=
            event.event_properties.time_spent_seconds;
        } else if (
          event.event_type === "Time Spent on Screen" &&
          event.user_id === userId &&
          event.event_properties?.screen === "SpellingGame" &&
          typeof event.event_properties.time_spent_seconds === "number"
        ) {
          const spellingTimestamp = event.event_properties.timestamp;
          if (
            !spellingTimestamp ||
            isNaN(new Date(spellingTimestamp).getTime())
          ) {
            console.warn(
              "Skipping SpellingGame event with invalid timestamp:",
              spellingTimestamp
            );
            continue;
          }

          const eventDate = new Date(spellingTimestamp)
            .toISOString()
            .split("T")[0];

          if (!dailyTotals.SpellingGame[eventDate]) {
            dailyTotals.SpellingGame[eventDate] = 0;
          }
          dailyTotals.SpellingGame[eventDate] +=
            event.event_properties.time_spent_seconds;
        } else if (
          event.event_type === "Time Spent on Screen" &&
          event.user_id === userId &&
          event.event_properties?.screen === "PhonicsGame" &&
          typeof event.event_properties.time_spent_seconds === "number"
        ) {
          const phonicsTimestamp = event.event_properties.timestamp;
          if (
            !phonicsTimestamp ||
            isNaN(new Date(phonicsTimestamp).getTime())
          ) {
            console.warn(
              "Skipping PhonicsGame event with invalid timestamp:",
              phonicsTimestamp
            );
            continue;
          }

          const eventDate = new Date(phonicsTimestamp)
            .toISOString()
            .split("T")[0];

          if (!dailyTotals.PhonicsGame[eventDate]) {
            dailyTotals.PhonicsGame[eventDate] = 0;
          }
          dailyTotals.PhonicsGame[eventDate] +=
            event.event_properties.time_spent_seconds;
        }
      }
    });

    res.json({
      userId,
      dailyTimeSpentSeconds: dailyTotals,
    });
  } catch (err) {
    console.error("Amplitude error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to fetch or process data" });
  }
};
