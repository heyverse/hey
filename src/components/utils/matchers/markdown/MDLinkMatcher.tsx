import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';
import { v4 as uuidv4 } from 'uuid';

const createHyperlink = (href: string | undefined, display: string | undefined) => {
  const keyId = '_' + href + '-' + uuidv4().slice(-7);
  return (
    <a key={keyId} href={href} target="_blank">
      {display}
    </a>
  );
};

export class MDLinkMatcher extends Matcher {
  replaceWith(children: ChildrenNode, props: any) {
    return createHyperlink(props.href, props.title);
  }

  asTag(): string {
    return 'a';
  }

  match(value: string) {
    return this.doMatch(value, /\[(.*?)\]\((.*?)\)/u, (matches) => ({
      href: matches[2],
      title: matches[1]
    }));
  }
}
