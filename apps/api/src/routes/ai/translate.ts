import type { Context } from "hono";
import getDbPostId from "src/utils/getDbPostId";
import lensPg from "src/utils/lensPg";
import openRouter from "src/utils/openRouter";
import { generateExtraLongExpiry, getRedis, setRedis } from "src/utils/redis";

const translate = async (ctx: Context) => {
  const defaultResponse = ctx.json({
    success: true,
    data: { text: "Can't translate this post" }
  });

  try {
    const { post } = await ctx.req.json();
    const cacheKey = `ai:translate:${post}`;
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      return ctx.json({ success: true, data: { text: cachedData } });
    }

    const metadata = (await lensPg.query(
      `
        SELECT content, language
        FROM post.metadata
        WHERE post = $1;
      `,
      [getDbPostId(post)]
    )) as Array<{ content?: string }>;

    const text = metadata[0]?.content;

    if (!text) {
      return defaultResponse;
    }

    const completion = await openRouter.chat.completions.create({
      model: "mistralai/devstral-small:free",
      messages: [
        {
          role: "user",
          content:
            "You are a translation assistant. Translate all incoming text to English, and return only the translated output."
        },
        { role: "user", content: text }
      ]
    });

    const translatedText = completion.choices[0].message.content;

    if (!translatedText) {
      return defaultResponse;
    }

    await setRedis(cacheKey, translatedText, generateExtraLongExpiry());

    return ctx.json({ success: true, data: { text: translatedText } });
  } catch {
    return defaultResponse;
  }
};

export default translate;
