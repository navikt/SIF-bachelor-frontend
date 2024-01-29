import { ThumbUpIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import '../index.css'; // Correct relative path to import index.css

const Home = () => (
  <main className="main">
    <Button icon={<ThumbUpIcon title="a11y tittel" />}>Knapp</Button>
  </main>
);

export default Home;
