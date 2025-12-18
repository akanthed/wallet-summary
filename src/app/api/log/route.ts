import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, payload } = body;

    // In a real-world scenario, you would send this data to your analytics service
    // For this example, we'll just log it to the server console
    console.log(`[Analytics Event] ${eventName}:`, JSON.stringify(payload || {}));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging analytics event:', error);
    // Return a success response even if logging fails to not block client
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

// Added to handle preflight requests for CORS if the client and server are on different origins
export async function OPTIONS() {
  return NextResponse.json({ success: true }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
