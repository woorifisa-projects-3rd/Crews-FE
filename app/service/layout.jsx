import { Landing, NavigationService } from '@/components/common';
import { Flex } from '@radix-ui/themes';

export default function Layout({ children }) {
  return (
    <div className="service">
      <div className="size">
        <Flex justify="center">
          <section className="landing">
            <Landing />
          </section>
          <section className="webview">
            <div className="container">{children}</div>
            <NavigationService />
          </section>
        </Flex>
      </div>
    </div>
  );
}
