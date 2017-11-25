import * as React from 'react';
import CSSProperties from './CSSProperties';
import { cache } from './jsxstyle';

export type MQProps = {
  className?: string;
  style?: React.CSSProperties;
  query: string;
} & CSSProperties;

export type OldStyleProps = {
  mediaQueries: { mq: string };
} & CSSProperties;

function wrapPropsWithMQPrefix(props: MQProps): OldStyleProps {
  const ret = { mediaQueries: { mq: props.query } };
  for (const k in props) {
    if (k === 'query' || k === 'children') continue;
    ret[`mq${k[0].toUpperCase()}${k.slice(1)}`] = props[k];
  }
  return ret;
}

export default class MediaQuery extends React.PureComponent<MQProps> {
  className: string | null;

  constructor(props: MQProps) {
    super(props);
    this.className = cache.getClassName(
      wrapPropsWithMQPrefix(props),
      this.props.className,
      true
    );
  }

  componentWillReceiveProps(props: MQProps) {
    this.className = cache.getClassName(
      wrapPropsWithMQPrefix(props),
      this.props.className,
      true
    );
  }

  render() {
    const onlyChild = React.Children.only(this.props.children);
    const props = { ...onlyChild.props, className: this.className };
    return React.cloneElement(onlyChild, props);
  }
}
