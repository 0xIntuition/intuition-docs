import type { ComponentProps, ReactNode } from 'react';
import {
  ReactIcon,
  AngularIcon,
  AndroidIcon,
  AppleIcon,
  FlutterIcon,
  HTMLIcon,
  JSIcon,
} from './icons';

export type Section = { docId: string } & (
  | {
      section: false;
    }
  | {
      section: string;
      icon: (props: ComponentProps<'svg'>) => ReactNode;
      name: string;
    }
);

const SECTIONS: Section[] = [
  {
    name: 'React',
    docId: 'react',
    icon: ReactIcon,
    section: 'react-sdk',
  },
];

export type SectionsGroup = {
  name: string;
  section: string;
  description?: string;
  className?: string;
};

const SECTION_GROUPS: SectionsGroup[][] = [
  [
    {
      name: '1UI',
      section: 'react-sdk',
      className: 'deprecated-badge',
    },
  ],
  [
    {
      name: '1UI',
      section: 'react-sdk',
      description:
        'Use our pre-built UI components as a base to build on top of.',
    },
  ],
];

export { SECTIONS, SECTION_GROUPS };
