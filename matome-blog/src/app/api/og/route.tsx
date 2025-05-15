import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'YouTube Summary Blog';
    const description = searchParams.get('description') || 'YouTube動画の要約ブログ';

    // ベースURL取得（ホスト部分）
    const { origin } = new URL(request.url);
    
    // 日本語フォントの読み込み - publicディレクトリから取得
    const fontData = await fetch(
      `${origin}/fonts/NotoSansJP-Bold.ttf`
    ).then((res) => res.arrayBuffer());
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom right, #f0f0f0, #ffffff)',
            borderRadius: '12px',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '20px',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '30px',
              fontFamily: '"Noto Sans JP", sans-serif',
              color: '#666666',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            {description}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontFamily: '"Noto Sans JP", sans-serif',
              color: '#666666',
            }}
          >
            YouTube Summary Blog
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans JP',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
        ],
      },
    );
  } catch (e) {
    console.log(`${e}`);
    return new Response(`Failed to generate the image: ${e}`, {
      status: 500,
    });
  }
}
