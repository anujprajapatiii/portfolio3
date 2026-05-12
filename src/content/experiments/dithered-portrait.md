---
title: Dithered portrait
description: Atkinson dithering applied to a webcam feed in real time, rendered to a Canvas.
date: 2026-03-14
tags: [canvas, image, generative]
repo: https://github.com/anuj/dithered-portrait
---

## What

A `<video>` element feeds a hidden `<canvas>`, which dithers each frame using the Atkinson algorithm (the one the original Mac used). Output is binary — pure black, pure white — at any resolution.

## Why

I wanted to see how cheap it is, framerate-wise, to dither a 1280×720 stream in plain JavaScript with no GPU acceleration. Answer: ~25fps on an M2. Acceptable.

## What I'd do next

Move the dither pass to a fragment shader. The CPU implementation is bottlenecked on the per-pixel error diffusion, which is the kind of thing GPUs eat for breakfast.
