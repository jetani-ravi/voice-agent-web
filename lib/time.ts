import moment from "moment-timezone";

export const timezones = moment.tz.names().map((tz) => {
  const offsetMinutes = moment.tz(tz).utcOffset();
  const hours = Math.floor(Math.abs(offsetMinutes) / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.abs(offsetMinutes) % 60).toString().padStart(2, "0");
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const formattedOffset = `UTC${sign}${hours}:${minutes}`;
  return {
    value: tz,
    label: `(${formattedOffset}) ${tz.replace(/_/g, " ")}`, // Clean timezone name
  };
});
