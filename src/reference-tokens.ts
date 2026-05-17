// Token data for the /reference page, extracted so it is a named module
// instead of buried in a 565-line page — and so the drift checker
// (scripts/check-tokens.mjs) has a single structured source to compare
// against src/styles/global.css. `npm run check:tokens` fails if the
// literal values here diverge from the CSS. Keep them in sync; the
// checker is the safety net, not a substitute for editing both.

export const fontTokens = [
    { name: '--font-display', value: '72px', use: 'hero / landing moments' },
    { name: '--font-xl', value: '40px', use: 'page heading' },
    { name: '--font-lg', value: '24px', use: 'in-body heading, homepage intro' },
    { name: '--font-base', value: '18px', use: 'body' },
    { name: '--font-sm', value: '16px', use: 'secondary body, card descriptions' },
    { name: '--font-xs', value: '13px', use: 'fine print, captions' },
];

export const leadingTokens = [
    { name: '--leading-display', value: '1.05', use: '40px+' },
    { name: '--leading-tight', value: '1.3', use: '22–32px' },
    { name: '--leading-base', value: '1.5', use: 'body default' },
    { name: '--leading-loose', value: '1.6', use: 'long-form reading' },
];

export const trackingTokens = [
    { name: '--tracking-tight', value: '-0.015em', use: 'display sizes' },
];

export const spaceTokens = [
    { name: '--space-1', value: '4px' },
    { name: '--space-2', value: '8px' },
    { name: '--space-3', value: '16px' },
    { name: '--space-4', value: '24px' },
    { name: '--space-5', value: '32px' },
    { name: '--space-6', value: '48px' },
    { name: '--space-7', value: '80px' },
    { name: '--space-8', value: '120px' },
];

export const primitiveFamilies = [
    {
        name: 'Neutral',
        swatches: [
            { name: 'black', value: '#000000' },
            { name: '900', value: '#0e0f12' },
            { name: '800', value: '#141619' },
            { name: '700', value: '#1c1f24' },
            { name: '600', value: '#21252b' },
            { name: '500', value: '#2c323a' },
            { name: '400', value: '#434b56' },
            { name: '300', value: '#99a1ac' },
            { name: '200', value: '#d3d7dd' },
            { name: '100', value: '#f6f7f8' },
            { name: 'white', value: '#ffffff' },
        ],
    },
    {
        name: 'Blue',
        swatches: [
            { name: '100', value: '#f0f3ff' },
            { name: '200', value: '#dae5ff' },
            { name: '300', value: '#99b6ff' },
            { name: '400', value: '#1e50d3' },
            { name: '500', value: '#1841ac' },
            { name: '600', value: '#002c83' },
        ],
    },
    {
        name: 'Yellow',
        swatches: [
            { name: '100', value: '#fff5f5' },
            { name: '200', value: '#ffe9d0' },
            { name: '300', value: '#ffd293' },
            { name: '400', value: '#ffb700' },
            { name: '500', value: '#d17600' },
            { name: '600', value: '#853e0f' },
        ],
    },
    {
        name: 'Red',
        swatches: [
            { name: '100', value: '#f7a1a2' },
            { name: '200', value: '#f2696a' },
            { name: '300', value: '#ec2426' },
            { name: '400', value: '#67090a' },
        ],
    },
    {
        name: 'Green',
        swatches: [
            { name: '100', value: '#b4e4be' },
            { name: '200', value: '#53c069' },
            { name: '300', value: '#37954a' },
            { name: '400', value: '#1a4723' },
        ],
    },
    {
        name: 'Amber',
        swatches: [
            { name: '100', value: '#f5c2a3' },
            { name: '200', value: '#ee9a68' },
            { name: '300', value: '#e66c24' },
            { name: '400', value: '#7c370e' },
        ],
    },
    {
        name: 'Standard',
        swatches: [{ name: 'terra', value: '#847b73' }],
    },
];

export const colorTokens = [
    { name: '--color-text', light: 'neutral-600', dark: 'neutral-200', use: 'primary text' },
    { name: '--color-muted', light: 'neutral-400', dark: 'neutral-300', use: 'secondary text' },
    { name: '--color-bg', light: 'neutral-100', dark: 'neutral-800', use: 'page background' },
    {
        name: '--color-border',
        light: 'neutral-300',
        dark: 'neutral-500',
        use: 'dividers, borders',
    },
    {
        name: '--color-surface',
        light: 'neutral-200',
        dark: 'neutral-400',
        use: 'image placeholder',
    },
    {
        name: '--color-code-bg',
        light: 'neutral-200',
        dark: 'neutral-700',
        use: 'inline code, code blocks',
    },
    { name: '--color-btn-bg', light: 'color-text', dark: 'color-text', use: 'primary button fill' },
    { name: '--color-btn-fg', light: 'color-bg', dark: 'color-bg', use: 'primary button label' },
    {
        name: '--color-surface-hover',
        light: 'neutral-200',
        dark: 'neutral-500',
        use: 'card / ghost hover wash',
    },
    {
        name: '--color-pressed',
        light: 'neutral-300',
        dark: 'neutral-400',
        use: 'button :active tint',
    },
];

export const widthTokens = [
    { name: '--width-page', value: '880px', use: 'outer page container' },
    { name: '--width-reading', value: '680px', use: 'long-form text column' },
    { name: '--width-narrow', value: '600px', use: 'about, intro' },
];

export const breakpointTokens = [
    { name: '--bp-sm', value: '480px', use: 'small mobile → larger mobile' },
    { name: '--bp-md', value: '768px', use: 'mobile → tablet (primary split)' },
    { name: '--bp-lg', value: '1024px', use: 'tablet → laptop' },
    { name: '--bp-xl', value: '1280px', use: 'laptop → desktop' },
];

export const motionTokens = [
    { name: '--transition', value: '0.15s', use: 'theme swap, header, default' },
    { name: '--transition-fast', value: '0.1s', use: 'button press / hover feedback' },
    { name: '--ease-standard', value: 'cubic-bezier(0.2, 0, 0, 1)', use: 'hover transitions' },
    { name: '--ease-out', value: 'cubic-bezier(0, 0, 0.2, 1)', use: 'press release, card lift' },
];

export const layoutPrimitives = [
    {
        name: '<PageWrapper>',
        props: 'no props',
        use: 'horizontal page padding (24px mobile, 32px tablet+). Used by header, main, footer.',
    },
    {
        name: '<Section size>',
        props: 'size: sm | md | lg | xl',
        use: 'vertical chunk of a page. padding-block per size. Default md.',
    },
    {
        name: '<Container size>',
        props: 'size: page | reading | narrow',
        use: 'max-width + center. Inside Section. Default page.',
    },
    {
        name: '<Stack gap>',
        props: 'gap: sm | md | lg',
        use: 'vertical flex with gap. Default md.',
    },
    {
        name: '<Cluster gap align justify as>',
        props: 'gap, align, justify, as',
        use: 'horizontal flex with wrap. For nav, tag rows.',
    },
    {
        name: '<Grid min gap>',
        props: 'min: 220px | 280px | 360px; gap: md | lg',
        use: 'auto-fit responsive grid. No media query needed.',
    },
];

export const sectionSizes = [
    { size: 'sm', value: '32px', use: 'tight related blocks' },
    { size: 'md', value: '48px', use: 'default' },
    { size: 'lg', value: '80px', use: 'distinct page chapters' },
    { size: 'xl', value: '120px', use: 'hero / landing' },
];

export const weights = [
    { value: 100, label: 'Thin' },
    { value: 200, label: 'Extra Light' },
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
    { value: 800, label: 'Extra Bold' },
    { value: 900, label: 'Black' },
];
