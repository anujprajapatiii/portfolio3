import StackDemo from './Stack.demo.astro';

export default {
    component: StackDemo,
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
