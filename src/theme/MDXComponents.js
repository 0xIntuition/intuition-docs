// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import ColorCode from '../components/ColorCode';
import ColorPalette from '../components/ColorPalette';
import PropsTable from '../components/PropsTable';
import ComponentsGrid from '../components/ComponentsGrid';
import { CardSection, Card } from '../components/CardComponents';
import * as icons from '../icons';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  ...icons,

  Tabs,
  TabItem,

  color: ColorCode,
  ColorPalette,
  PropsTable,
  ComponentsGrid,
  CardSection,
  Card,
};
