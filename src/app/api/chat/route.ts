import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { developer_message, user_message, conversation_history, api_key } = body;

    if (!api_key || !user_message) {
      return NextResponse.json(
        { error: 'API key and user message are required' },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: api_key,
    });

    // Build the messages array with conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: developer_message || 'You are a helpful AI assistant.' }
    ];

    // Add conversation history
    if (conversation_history && Array.isArray(conversation_history)) {
      messages.push(...conversation_history);
    }

    // Add the current user message
    messages.push({ role: 'user', content: user_message });

    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
    });

    // Create a readable stream
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
} 