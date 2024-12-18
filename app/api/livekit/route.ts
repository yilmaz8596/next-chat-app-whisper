import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(req: NextRequest) {
  try {
    const room = req.nextUrl.searchParams.get('room');
    const username = req.nextUrl.searchParams.get('username');

    console.log('Received request with:', { room, username });

    // Validate inputs
    if (!room) {
      return NextResponse.json({ error: 'Missing room parameter' }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ error: 'Missing username parameter' }, { status: 400 });
    }

    // Retrieve LiveKit credentials
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    // Log credentials for debugging
    console.log('LiveKit Credentials:', { 
      apiKeyProvided: !!apiKey, 
      apiSecretProvided: !!apiSecret, 
      wsUrlProvided: !!wsUrl 
    });

    // Validate credentials
    if (!apiKey || !apiSecret || !wsUrl) {
      console.error('Missing LiveKit credentials', { apiKey, apiSecret, wsUrl });
      return NextResponse.json({ 
        error: 'LiveKit server misconfigured',
        details: {
          apiKey: !!apiKey,
          apiSecret: !!apiSecret,
          wsUrl: !!wsUrl
        }
      }, { status: 500 });
    }

    // Create access token
    const token = new AccessToken(apiKey, apiSecret, {
      identity: username,
      // Optional: add expiration
      ttl: 3600 // 1 hour
    });

    // Add room grant
    token.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true
    });

    // Generate JWT
    const jwt = await token.toJwt();

    // Return token
    return NextResponse.json({ 
      token: jwt,
      room,
      username
    });

  } catch (error) {
    // Comprehensive error logging
    console.error('Token generation error:', error);

    return NextResponse.json({ 
      error: 'Failed to generate LiveKit token',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}