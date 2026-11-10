#!/usr/bin/env python3
"""
Preprocess photo for OG image — crop to face area, resize to 600x630.

Source: assets/dima-portrait-photo.jpg (2855x2855, square)
Output: /tmp/og-photo.jpg (600x630, face-focused)

Run from repo root:
    python3 scripts/gen_og_photo.py
"""
from PIL import Image
from pathlib import Path

# Path relative to repo root
SRC = Path(__file__).parent.parent / "assets" / "dima-portrait-photo.jpg"
OUT = Path("/tmp/og-photo.jpg")

src = Image.open(SRC).convert("RGB")
W, H = src.size  # 2855, 2855
print(f"Source: {W}x{H}")

# Smart crop: upper 5% to 80% vertically (face is in upper portion)
crop_top = int(H * 0.05)
crop_bottom = int(H * 0.80)
crop_size = crop_bottom - crop_top  # ~2142
crop_left = (W - crop_size) // 2
crop_right = crop_left + crop_size

cropped = src.crop((crop_left, crop_top, crop_right, crop_bottom))
print(f"Cropped: {cropped.size} (face-focused)")

# Resize to 600x630
resized = cropped.resize((600, 630), Image.LANCZOS)
resized.save(OUT, "JPEG", quality=90)
print(f"Saved: {OUT} ({OUT.stat().st_size} bytes, {resized.size})")
