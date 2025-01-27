import { formatDuration, intervalToDuration } from "date-fns";
import { pt } from "date-fns/locale";
function useTimeConverter() {
  const convertMinutes = (minutes: number) => {
    const duration = intervalToDuration({
      start: 0,
      end: minutes * 60 * 1000,
    });

    const formatted = formatDuration(duration, {
      format: ["days", "hours", "minutes"],
      zero: false,
      locale: pt,
      delimiter: ", ",
    });

    return formatted;
  };

  return { convertMinutes };
}

export default useTimeConverter;
