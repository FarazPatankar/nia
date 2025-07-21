import { useLoaderData } from "react-router";
import { z } from "zod";
import { H3, P, Small } from "~/components/ui/typography";

import { envs } from "~/lib/env";

const OURA_BASE_URL = "https://api.ouraring.com/v2";
const OURA_ROUTES = {
  sleepData: `${OURA_BASE_URL}/usercollection/sleep`,
};

const sleepDataSchema = z.object({
  data: z.array(
    z.object({
      total_sleep_duration: z.number(),
      type: z.string(),
    }),
  ),
});

export const loader = async () => {
  try {
    const sleepResponse = await fetch(OURA_ROUTES.sleepData, {
      headers: {
        Authorization: `Bearer ${envs.OURA_PAT}`,
      },
    });
    const sleepResult = await sleepResponse.json();
    const parsedSleepResult = sleepDataSchema.parse(sleepResult);

    const lastSleep = parsedSleepResult.data.find(r => r.type === "long_sleep");
    if (lastSleep == null) {
      return {
        status: "error",
        lastSleep: null,
        error: "No long sleep data found",
      };
    }

    return {
      status: "success",
      lastSleep,
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      lastSleep: null,
      error: error.message ?? "Unknown error",
    };
  }
};

const secondsToHoursAndMinutes = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const NowItem = ({ emoji, text }: { emoji: string; text: string }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg" role="img">
        {emoji}
      </span>
      <P className="font-medium">{text}</P>
    </div>
  );
};

const Now = () => {
  const { status, lastSleep } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <H3>goals</H3>
        <P>lose weight. sleep better. paint more. cook more.</P>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start gap-2">
          <NowItem emoji="🏠" text="bangalore" />
          {lastSleep != null && (
            <NowItem
              emoji="😴"
              text={`${secondsToHoursAndMinutes(
                lastSleep.total_sleep_duration,
              )} last night`}
            />
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-border mt-4 mb-2" />
    </div>
  );
};

export default Now;
