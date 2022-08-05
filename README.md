<h1 align="center">Emoji Battle</h1>
<h2 align="center">🤪 ⚔️ 😀</h2>

<p align="center">
A simple, multiplayer game built with the full-stack Jamstack.
</p>

![emoji-battle-round-in-progress](https://user-images.githubusercontent.com/147237/183110938-345db52f-191f-47b7-94d8-666dc2bd3dbd.png)


### Libraries

- [Next.js](https://nextjs.org/) / [React](https://reactjs.org/)
- [Ably Realtime](https://github.com/ably)
- [Prisma](https://www.prisma.io/)
- [Chakra-UI](https://chakra-ui.com/)
- [emoji-mart](https://github.com/missive/emoji-mart)
- [NextAuth.js](https://next-auth.js.org/)

### Prerequisites

1. PostgreSQL (I recommend [Postgres.app](https://postgresapp.com/) on Mac)
1. A free [Ably](https://ably.com/) account.
1. An Ably [API key](https://faqs.ably.com/setting-up-and-managing-api-keys).
1. Create a [GitHub OAuth app](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app). You'll need the private key and secret to enable GitHub authentication.
1. You'll also need to install the [Emoji Battle timer server](https://github.com/mcavaliere/emoji-battle-api) locally.

### Installation

1. Clone the repository.
2. `yarn` or `yarn install`.
3. Copy `.env.example` to `.env` and fill in the values.

### Running the app

In one terminal window, start the client:

`yarn dev`

In another, start the timer server:

`yarn start:dev`

Visit `http://localhost:3000` to play on your local machine 🎉. Happy battling!

### Contributing

Reach out to me on Twitter: [@mcavaliere](https://twitter.com/mcavaliere). 

-----


<p align="center"><b>Built by <a href="https://mikecavaliere.com/">Mike Cavaliere</a> (<a href="https://twitter.com/mcavaliere">@mcavaliere</a>)</b></p>

<p align="center"><b>Supported by <a href="https://echobind.com/">Echobind</a> (<a href="https://twitter.com/echobind">@echobind</a>).</b></p>
