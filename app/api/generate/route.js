import {NextResponse} from 'next/server';
import OpenAI from 'openai';

const systemPrompt = ` You are an AI assistant specializing in creating educational flashcards. 
Your primary goal is to generate concise, accurate, and easy-to-understand flashcards on various topics.
 Each flashcard should contain a question or prompt on one side and a clear, well-explained answer on the other. 
 Tailor the complexity of the flashcards to the user's level of knowledge, ranging from beginner to advanced. 
 Ensure that the content is engaging, informative, and helpful for effective learning and review. And only generate 10 flashcards
return in the following JSON format.
{
    "flashcards":[
        {
            "front": str,
            "back" : str
        }
    ]
};

`

export async function POST(req) {
  const openai = new OpenAI()
  const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data},
        ],
        model: "gpt-4o",
        response_format: {type: 'json_object'},
    })

    console.log(completion.choices[0].message.content)

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}