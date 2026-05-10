app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  const prompt = `
You are a shopping assistant.

User: ${message}
`;

  // call Hugging Face
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
      },
    }
  );

  const reply = response.data[0].generated_text;

  res.json({ reply });
});