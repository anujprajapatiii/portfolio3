import Stack from './Stack.astro';

export default {
    component: Stack,
};

export const SmallGap = {
    args: { gap: 'sm' },
};

export const MediumGap = {
    args: { gap: 'md' },
};

export const LargeGap = {
    args: { gap: 'lg' },
};
