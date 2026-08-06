import { NodeTypes } from 'reactflow';
import Database from './DatabaseNode';
import LogoNode from './LogoNode';
import Phone from './Phone';
import { PositionLoggerNode } from './PositionLoggerNode';

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
  phone: Phone,
  database: Database,
  logo: LogoNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
