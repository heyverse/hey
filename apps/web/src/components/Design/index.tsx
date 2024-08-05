import type { NextPage } from 'next';

import { GridLayout } from '@hey/ui';
import { GridItemTwelve } from '@hey/ui/src/GridLayout';

import AlertDesign from './AlertDesign';
import ButtonsDesign from './ButtonsDesign';
import ProfilesDesign from './ProfilesDesign';
import TypographyDesign from './TypographyDesign';

const Design: NextPage = () => {
  return (
    <GridLayout>
      <GridItemTwelve className="space-y-5">
        <TypographyDesign />
        <ButtonsDesign />
        <AlertDesign />
        <ProfilesDesign />
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Design;
