import { Heading } from '@chakra-ui/react';

export const LoggedOutBranding = () => (
  <>
    <Heading size='3xl'>🤪 ⚔️ 😀</Heading>
    <Heading size='xl'>Emoji Battle</Heading>
    <Heading size='md' mb={20} textAlign='center'>
      Welcome to the Dojo.
    </Heading>
  </>
);

export const LoggedInBranding = ({ name }) => (
  <>
    <Heading mb={5} textAlign='center'>
      Emoji 🤪 ⚔️ 😀 Battle
    </Heading>

    {name && (
      <>
        <Heading size='md' mb={20} textAlign='center'>
          Welcome to the Dojo, {name}.
        </Heading>
      </>
    )}
  </>
);
