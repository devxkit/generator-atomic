import React from 'react'<%- styleImport %>
<%- withClassNameImport %>

<%- withClassNameProps %> {
}

const <%- name %> = (props: Props): React.ReactElement => {
  return (
    <<%- templateBaseComponent %> <%- withClassNameClassName %>data-testid={"<%- name %>-root"}>
      <%- name %>
    </<%- templateBaseComponent %>>
  );
}

export { <%- name %> }
