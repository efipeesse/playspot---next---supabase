
export const metadata = {
  title: "PlaySpot • Descubra jogos e baixe nas lojas oficiais",
  description:
    "PlaySpot é um hub para descobrir jogos e ir direto para as lojas oficiais, como Steam, Riot e outras.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui,-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
