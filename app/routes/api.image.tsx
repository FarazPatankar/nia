import { LoaderFunctionArgs } from "react-router";
import satori, { SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import tinycolor from "tinycolor2";

import { getIconCode, loadEmoji } from "~/lib/twemoji";

declare module "react" {
  interface HTMLAttributes<T> {
    tw?: string;
  }
}

async function getFont(
  font: string,
  weights = [400, 500, 600, 700],
  text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\!@#$%^&*()_+-=<>?[]{}|;:,.`'’\"–—",
) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${font}:wght@${weights.join(
      ";",
    )}&text=${encodeURIComponent(text)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    },
  ).then(response => response.text());
  const resource = css.matchAll(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/g,
  );
  return Promise.all(
    [...resource]
      .map(match => match[1])
      .map(url => fetch(url).then(response => response.arrayBuffer()))
      .map(async (buffer, i) => ({
        name: font,
        style: "normal",
        weight: weights[i],
        data: await buffer,
      })),
  ) as Promise<SatoriOptions["fonts"]>;
}

const GRID_ROWS = 5;
const GRID_COLS = 5;
const FALLBACK_COLOR = "#ee9ca7";

// Extract primary fill color from Twemoji SVG
function extractFriendlyColorFromSvg(svg: string): string | null {
  const matches = svg.match(/fill="(#[0-9a-fA-F]{3,6})"/g);
  if (!matches) return null;

  const colorCounts: Record<string, number> = {};
  for (const match of matches) {
    const color = match.replace(/fill="|"/g, "");
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  }

  const sorted = Object.entries(colorCounts)
    .map(([hex, count]) => ({
      hex,
      count,
      color: tinycolor(hex),
    }))
    .filter(c => c.color.isValid())
    .filter(c => {
      const { l, s } = c.color.toHsl();
      return l > 0.4 && s > 0.4; // brighter & more saturated
    })
    .sort((a, b) => b.count - a.count);

  return sorted.length > 0 ? sorted[0].hex : Object.keys(colorCounts)[0];
}

function generateEmojiGrid(rows: number, cols: number) {
  return Array.from({ length: rows * cols }).map((_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    const jitter = (range: number) => (Math.random() - 0.5) * range;
    return {
      top: `${row * cellHeight + jitter(cellHeight * 0.6)}%`,
      left: `${col * cellWidth + jitter(cellWidth * 0.6)}%`,
      rotate: Math.random() * 360,
    };
  });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const emoji = url.searchParams.get("emoji") ?? "✨";
  const title = url.searchParams.get("title");
  const description = url.searchParams.get("description");
  const category = url.searchParams.get("category");

  const emojiSvg = await loadEmoji("twemoji", getIconCode(emoji));

  const backgroundColor = tinycolor(
    extractFriendlyColorFromSvg(emojiSvg) ?? FALLBACK_COLOR,
  )
    .lighten(15)
    .toHexString();
  const textColor = tinycolor
    .mostReadable(backgroundColor, ["#fff", "#000"], {
      level: "AA",
      size: "large",
    })
    .toHexString();

  const outlines = generateEmojiGrid(GRID_ROWS, GRID_COLS);

  const jsx = (
    <div
      tw="flex flex-col px-20 pt-20 pb-6 h-full w-full relative"
      style={{
        backgroundColor,
      }}
    >
      <div tw="flex absolute inset-0 z-0 overflow-hidden">
        {outlines.map((o, i) => (
          <span
            key={i}
            tw="absolute text-5xl"
            style={{
              top: o.top,
              left: o.left,
              transform: `rotate(${o.rotate}deg)`,
              opacity: 0.15,
              filter: "grayscale(0.85)",
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
      <div tw="flex flex-1 flex-row h-[480px] items-center justify-center">
        <span tw="text-[240px] leading-none">{emoji}</span>
        <div tw="flex flex-col ml-8">
          <span tw="font-bold text-6xl max-w-lg" style={{ color: textColor }}>
            {title}
          </span>
          <span
            tw="mt-4 text-2xl max-w-xl opacity-75"
            style={{ color: textColor }}
          >
            {description}
          </span>
        </div>
      </div>
      <div
        tw="flex uppercase font-medium mt-auto mx-auto"
        style={{ color: tinycolor(textColor).setAlpha(0.6).toRgbString() }}
      >
        <span>{category}</span>
        <span tw="mx-2 opacity-25">|</span>
        <span>nandakinii.com</span>
      </div>
    </div>
  );

  const svg = await satori(jsx, {
    width: 1200,
    height: 600,
    fonts: await getFont("Inter"),
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === "emoji") {
        return `data:image/svg+xml;base64,${btoa(emojiSvg)}`;
      }
      return code;
    },
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const data = pngData.asPng();

  return new Response(data, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
