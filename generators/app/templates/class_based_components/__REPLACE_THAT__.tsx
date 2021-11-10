import {Component} from 'react';<%- styleImport %>;
<%- withClassNameImport %>

interface State {
}

<%- withClassNameProps %> {
}

export class <%- name %> extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <<%- templateBaseComponent %> <%- withClassNameClassName %>data-testid={"<%- name %>-root"}>
        <%- name %>
      </<%- templateBaseComponent %>>
    );
  }
}
