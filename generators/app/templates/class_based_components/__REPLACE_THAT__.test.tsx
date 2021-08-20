import {render, screen} from '@testing-library/react';
<%- componentImport %>

const elementName = '<%- name %>';
const basicElement = <<%- name %>><%- name %></<%- name %>>;

test('element exists', () => {
  render(basicElement);

  const root = screen.getByTestId(elementName + '-root');
  expect(root).toBeInTheDocument();
});
