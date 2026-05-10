import axios from 'axios';

function handler(req,res) {
    const userMessage=req.body.message;

    try{
        const response=await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                inputs: userMessage,
            },
            {
                headers:{
                    Authorization: `Bearer hf_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ2VvcmdlLWFpLWFzc2lzdGFudCIsImlhdCI6MTY5ODQ4ODQyM30.7n8sHqj3mN8u9aKj0e7h3vXo9sPzqkK8b9g5w6r8`
                }
            }
        );

        res.status(200).json({
            reply: response.data[0].generated_text,
        })
    }catch(err){
        res.status(500).json({error: "AI Failed to Generate Response"})
    }
} 