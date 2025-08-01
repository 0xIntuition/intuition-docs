import React from 'react';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export default function OneUI() {
  return (
    <Layout
      title="1UI"
      description="Documentation for the Intuition 1UI Package - A comprehensive UI component library for Intuition applications"
    >
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="mb-8 text-4xl font-bold">1UI</h1>
        
        <p className="mb-6 text-lg text-text-400">
          Welcome to the 1UI documentation. This package provides a comprehensive set of
          UI components and utilities for building beautiful Intuition applications.
          All components are fully customizable, accessible, and follow modern design principles.
        </p>

        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-primary-800">
            Check out our <a href="https://0xintuition.github.io/intuition-ts/" className="font-semibold underline">Storybook</a> for interactive examples and detailed component documentation.
          </p>
        </div>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Installation</h2>
        <Tabs>
          <TabItem value="npm" label="npm">
            <CodeBlock language="bash">
              npm install @intuition/1ui
            </CodeBlock>
          </TabItem>
          <TabItem value="yarn" label="yarn">
            <CodeBlock language="bash">
              yarn add @intuition/1ui
            </CodeBlock>
          </TabItem>
        </Tabs>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Getting Started</h2>
        <p className="mb-4">
          Import and use components in your application:
        </p>
        <CodeBlock language="javascript">
          {`import { Button, Card, Input } from '@intuition/1ui';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Component Categories</h2>
        
        <h3 className="mt-6 mb-3 text-xl font-semibold">Layout Components</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <code>Container</code> - Responsive container with max-width
          </li>
          <li className="mb-2">
            <code>Grid</code> - Flexible grid system
          </li>
          <li className="mb-2">
            <code>Stack</code> - Vertical or horizontal stacking
          </li>
          <li className="mb-2">
            <code>Card</code> - Container with elevation and padding
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Form Components</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <code>Input</code> - Text input field
          </li>
          <li className="mb-2">
            <code>Select</code> - Dropdown selection
          </li>
          <li className="mb-2">
            <code>Checkbox</code> - Checkbox input
          </li>
          <li className="mb-2">
            <code>Radio</code> - Radio button group
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">Interactive Components</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <code>Button</code> - Various button styles
          </li>
          <li className="mb-2">
            <code>Modal</code> - Dialog box
          </li>
          <li className="mb-2">
            <code>Dropdown</code> - Dropdown menu
          </li>
          <li className="mb-2">
            <code>Tabs</code> - Tabbed interface
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Theming</h2>
        <p className="mb-4">
          Customize the look and feel of components using our theming system:
        </p>
        <CodeBlock language="javascript">
          {`import { ThemeProvider } from '@intuition/1ui';

const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    // ... other colors
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    // ... other spacing values
  },
  // ... other theme properties
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app components */}
    </ThemeProvider>
  );
}`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Responsive Design</h2>
        <p className="mb-4">
          All components are responsive by default. Use our responsive utilities:
        </p>
        <CodeBlock language="javascript">
          {`import { useBreakpoint } from '@intuition/1ui';

function ResponsiveComponent() {
  const isMobile = useBreakpoint('md');
  
  return (
    <Stack direction={isMobile ? 'vertical' : 'horizontal'}>
      {/* Your content */}
    </Stack>
  );
}`}
        </CodeBlock>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Accessibility</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">All components follow WCAG 2.1 guidelines</li>
          <li className="mb-2">Keyboard navigation support</li>
          <li className="mb-2">Screen reader friendly</li>
          <li className="mb-2">ARIA attributes included by default</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Best Practices</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Use semantic HTML elements when possible</li>
          <li className="mb-2">Maintain consistent spacing using theme values</li>
          <li className="mb-2">Follow the component composition pattern</li>
          <li className="mb-2">Use responsive utilities for mobile-first design</li>
        </ul>

        <h2 className="mt-8 mb-4 text-2xl font-semibold">Need Help?</h2>
        <p className="mb-4">
          If you need assistance with 1UI, you can:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Visit our <a href="https://0xintuition.github.io/intuition-ts/" className="text-primary-500 hover:underline">Storybook</a> for interactive examples</li>
          <li className="mb-2">Check our <a href="/docs/components" className="text-primary-500 hover:underline">Component Documentation</a></li>
          <li className="mb-2">Join our <a href="/community" className="text-primary-500 hover:underline">Discord community</a></li>
        </ul>
      </div>
    </Layout>
  );
} 