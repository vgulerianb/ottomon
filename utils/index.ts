const openAiHandler = async (
  prisma: any,
  query: string,
  project_id: string
) => {
  try {
    const message = [
      {
        role: "system",
        content: `You are a human educator and generates 3 possible faqs  for every query. Do not give answers to the questions. Reply the questions as a array. Example response, ["question1","question2","question3"]`,
      },
      {
        role: "user",
        content: `This Phone has 3 Secret Tricks!
this is the Vivo v29 and there's three really special things about it for starters with this design Viva made over 1400 manual adjustments to magnetic fields to create this particular texture that you can see here there are 15 million particles per phone with the angle of each precisely tuned to get the right graduations of light and shadows second is the auralite with smart color temperature adjustments to help you easily take portrait shots in low light and night environments it's like a flash but just with nine times the light emitting area which basically makes it much softer and more sculpted light but also it can detect the color temperature of the room you're in and adjust its own color temperature to match so that your face looks clear soft and bright but as if you haven't even used a flash the third is that the selfie camera is wide enough to fit the entire group in while being 50 megapixels in resolution so selfies look almost like they've been taken on the rear set of cameras`,
      },
      {
        role: "assistant",
        content: `[ "What are some unique design features of the Vivo v29?","How does the auralite technology in the Vivo v29 improve low light photography?", "What are the advantages of the wide-angle selfie camera on the Vivo v29?"]`,
      },
      {
        role: "user",
        content: `DoodleTale | buildspace nights & weekends s3
Transforming children's creative designs into immersive stories, complete with educational quizzes and engaging mini-games! 
🔴 spectreseek meet DoodleTale. meet DoodleTale. meet DoodleTale. Transforming children's creative designs into immersive stories, complete with educational quizzes and engaging mini-games! Transforming children's creative designs into immersive stories, complete with educational quizzes and engaging mini-games! Transforming children's creative designs into immersive stories, complete with educational quizzes and engaging mini-games! say hi say hi discord: MariusS#9741       buildspace     spectate s4 is in progress buildspace we raised 10M from a16z and others.       we raised 10M from a16z and others.           we raised 10M from a16z and others. `,
      },
      {
        role: "assistant",
        content: `["What is DoodleTale?","What does DoodleTale do with children's creative designs?","Can you provide more information about buildspace and its funding?"]`,
      },
      {
        role: "user",
        content: query,
      },
    ];

    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-16k",
        messages: message,
        max_tokens: 1800,
        temperature: 0.1,
        stream: false,
      }),
    });
    const data = await response.json();

    if (data?.choices?.[0]?.message?.content)
      await prisma.faqs.create({
        data: {
          project_id: project_id,
          questions: JSON.parse(data?.choices?.[0]?.message?.content ?? null),
        },
      });
  } catch (e) {
    console.log(e);
  }
};

export { openAiHandler };
