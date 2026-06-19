# The MPEG Audio Lineage: MP1, MP2, MP3, and MP4

```json
{
  "id": "mpeg-audio-lineage",
  "title": "The MPEG Audio Lineage: MP1, MP2, MP3, and MP4",
  "category": "Audio",
  "tags": ["mpeg", "mp3", "mp2", "mp1", "mp4", "aac", "audio", "codecs", "psychoacoustics", "compression", "music", "history", "media"],
  "summary": "From uncompressed CD audio to perceptual codecs: how MPEG built MP1, MP2, and MP3, why MP3 rewired culture, and how MP4 became a multimedia container. Expanded reference, June 2026.",
  "library": "https://mpeg.chiariglione.org/",
  "intro": "Before streaming, a single song in raw CD quality was roughly 10 MB per minute. MPEG audio codecs throw away sound you cannot hear, shrinking files small enough for broadcast, portable players, and the early internet. MP3 is the famous one. MP4 is not a codec at all. It is a box that holds video, AAC audio, and metadata.",
  "sources": [
    "https://mpeg.chiariglione.org/",
    "https://www.iis.fraunhofer.de/en/ff/amm/prod/audiocodec/audiocodecs/mp3.html",
    "https://en.wikipedia.org/wiki/Moving_Picture_Experts_Group",
    "Operator report (MPEG Audio Report Expanded.md, June 2026)"
  ],
  "added": "2026-06-20 09:30 PT",
  "updated": "2026-06-20 09:30 PT",
  "verdict": "The ear is imperfect. MPEG exploited that. MP3 became infrastructure. MP4 became the box everything else lives in."
}
```

This entry files the operator's expanded MPEG audio report: origins, technology, culture, and the formats that rewired digital music and video. For hosting those MP3 files on a static site today, see [How to Host Music on Cloudflare R2](#/e/cloudflare-r2-music-hosting).

## Part I: The problem uncompressed audio created

A standard audio CD stores **PCM (Pulse-Code Modulation)**: raw digital samples. The Red Book standard (Philips and Sony, 1980) uses **44,100 samples per second**, **16 bits per sample**, **two channels** (stereo).

```
44,100 samples/sec × 16 bits × 2 channels = 1,411,200 bits/sec
≈ 1.41 Mbps
≈ 10 MB per minute
≈ ~650 MB per hour
```

On 28.8k and 56k modems, one uncompressed song took hours to download. Even early broadband struggled. The industry's catalog could not move digitally without **radical compression**. Psychoacoustic coding was built to solve that.

## Psychoacoustics: what you do not hear

Perceptual audio coding exploits measurable limits of human hearing. Three core phenomena MPEG layers use:

**1. Absolute Threshold of Hearing (ATH)**  
The ear cannot hear all frequencies equally. Sounds below the threshold (roughly 20 Hz to 20 kHz at low levels) are inaudible and can be discarded.

**2. Simultaneous masking (frequency masking)**  
A loud tone masks quieter nearby frequencies. The encoder calculates a dynamic masking threshold and drops components below it.

**3. Temporal masking**  
Masking persists before and after loud sounds: **pre-masking** (~20 ms before) and **post-masking** (up to 100–200 ms after). Critical for drum hits and transients.

**Critical bands and the Bark scale**  
The ear divides the spectrum into ~24 overlapping **critical bands**. MPEG psychoacoustic models work on these bands, not raw frequency bins, so bit allocation tracks perception.

### Sub-band coding

All three MPEG-1 audio layers use **sub-band coding**. A **Polyphase Quadrature Filter (PQF) bank** splits audio into 32 sub-bands. The psychoacoustic model assigns bits by **Signal-to-Mask Ratio (SMR)**: high SMR bands get more bits; low SMR bands get few or none. Allocation updates frame by frame.

```preview Uncompressed vs MP3 (size concept)
<style>
  .mpeg-cmp { font-family: system-ui, sans-serif; background: #0e1118; color: #e9eef6; padding: 20px; border-radius: 12px; max-width: 420px; }
  .mpeg-cmp table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .mpeg-cmp th, .mpeg-cmp td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #2a3040; }
  .mpeg-cmp th { color: #45d2ff; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }
  .mpeg-cmp .hi { color: #7dffa3; }
  .mpeg-cmp .lo { color: #ffc857; }
</style>
<div class="mpeg-cmp">
  <table>
    <tr><th>Format</th><th>~1 min stereo</th></tr>
    <tr><td>CD PCM (uncompressed)</td><td class="hi">~10 MB</td></tr>
    <tr><td>MP3 @ 128 kbps</td><td class="lo">~1 MB</td></tr>
    <tr><td>MP3 @ 192 kbps</td><td class="lo">~1.4 MB</td></tr>
  </table>
  <p style="font-size:12px;color:#888;margin:12px 0 0;">Rough guide. Actual file size varies with encoder and content.</p>
</div>
```

## Part II: The Moving Picture Experts Group

In January 1988, engineers met in Düsseldorf and formed **MPEG** (ISO/IEC JTC 1/SC 29/WG 11). **Leonardo Chiariglione** became convener. The mandate: open international standards for coded moving pictures and associated audio, avoiding another VHS vs. Betamax war.

MPEG standards emerge from **Calls for Proposals**, blind listening tests, and combining the best elements from multiple submissions. That process produces excellent specs and **patent pools**: many companies contribute patented techniques and later demand license fees. MP3's legal history followed directly from this.

## Part III: MPEG-1 Audio layers

### MUSICAM vs ASPEC

Two major 1989 proposals shaped the standard:

| Proposal | Consortium | Approach |
|----------|------------|----------|
| **MUSICAM** | Philips, IRT, CCETT | 32-subband PQF bank; efficient, robust |
| **ASPEC** | Fraunhofer IIS, AT&T, Thomson, CNET | MDCT + advanced psychoacoustic model; better at low bitrates, heavier CPU |

MPEG chose a **three-layer compromise**, not a single winner:

- **Layer I** — simplest MUSICAM form  
- **Layer II** — extended MUSICAM with finer bit allocation  
- **Layer III** — MUSICAM filter bank + ASPEC's MDCT and model  

The layers are distinct codecs, not quality presets.

### MP1 (Layer I)

- **384 samples per frame** (~38 frames/sec at 44.1 kHz)  
- Simple psychoacoustic Model 1; coarse bit allocation; no Huffman coding  
- Fast enough for 1990s hardware; aimed at **DCC (Digital Compact Cassette)**  
- Philips **PASC** at fixed 192 kbps marketed as "CD quality in your pocket"  
- DCC lost to Sony MiniDisc (1992); discontinued 1996  

### MP2 (Layer II)

- **1,152 samples per frame** (3× Layer I) for better frequency resolution  
- Three scale factors per sub-band with **SCFSI** selection  
- Finer requantization; sub-band grouping when step sizes match  
- ~192 kbps often transparent; 128 kbps shows degradation (where MP3 wins)  
- **Broadcast legacy:** DAB (1995) specified MP2 at 128–192 kbps; DVD-Video optional MP2 tracks kept it in production tools through the 2000s  

### MP3 (Layer III)

#### Erlangen and Fraunhofer

**Dieter Seitzer** (University of Erlangen-Nuremberg) asked in the early 1980s: can music fit a ~64 kbps phone line? **Karlheinz Brandenburg** pursued it as a PhD student; his 1989 thesis *Adiabatic Encoding of High-Quality Digital Audio* laid Layer III groundwork. He joined **Fraunhofer IIS** in 1989.

Key contributions: MDCT applied psychoacoustically, feedback loop when quantization noise exceeds masking threshold, and **pre-echo** control for transients.

#### "Tom's Diner"

Brandenburg tuned his model on **"Tom's Diner"** by Suzanne Vega: dry a cappella vocals expose artifacts instantly. He reportedly played the same seconds thousands of times. Vega later joked she was the "mother of MP3."

#### Hybrid filter bank

Unique to Layer III: 32-subband PQF **then** MDCT per sub-band (18 or 6 bins):

- **Long blocks (576 coeffs):** sustained tones, better frequency resolution  
- **Short blocks (192 coeffs):** transients, better time resolution, less pre-echo  
- **Start/stop blocks:** transitions between modes  

#### Two-pass noise shaping and bit reservoir

Encoder loop: analyze masking → quantize + Huffman code → verify noise vs threshold → re-quantize if needed until budget exhausted. Encoding runs slower than real-time at high quality.

The **bit reservoir** (up to 511 bytes) saves bits from easy frames for hard ones. **VBR** later formalized this: target quality, let bitrate vary.

#### Joint stereo

- **Mid/Side (M/S):** encode Mid (L+R) and Side (L−R); Side often smaller  
- **Intensity stereo:** at very low bitrates, high frequencies get pan parameter only  

#### Consumer explosion

| Year | Event |
|------|-------|
| 1993 | ISO/IEC 11172-3 published (Layers I–III) |
| 1995–97 | Fraunhofer l3enc, WinPlay3; **AMP** decoder (Tomislav Uzelac) |
| Jun 1997 | **Winamp** (Justin Frankel, Dmitry Boldyrev) |
| 1998 | **MPMan F10** first portable player; **Rio PMP300** (RIAA sued, lost) |
| Jun 1999 | **Napster** launches |
| 2001 | Napster shut down; decentralized successors follow |
| Apr 2003 | **iTunes Music Store** (AAC + DRM) |

#### Patents and ID3

Fraunhofer and Thomson licensed encoding/decoding for years. **LAME** (1998+) was structured carefully around patent jurisdictions. Major Fraunhofer MP3 patents expired by **April 2017**; MP3 is now royalty-free worldwide.

**ID3v1** (1996): 128-byte trailer, fixed fields. **ID3v2** (2.3 in 1999): header at file start, variable frames, Unicode, lyrics, **APIC** embedded album art.

<div class="lambda-tip">
<div class="lambda-tip-label">Lambda tip</div>
<p>MP3 is not "MP3 quality" in the abstract. Bitrate, encoder (LAME V0/V2), and source material all matter. A 128 kbps file from 1999 and a V0 encode from 2015 are different animals.</p>
</div>

## Part IV: MPEG-2 Audio

**MPEG-2 Audio (ISO/IEC 13818-3, 1994)** extended MPEG-1:

1. Lower sample rates: 16, 22.05, 24 kHz  
2. **Multichannel** up to 5.1 (backward compatible with MPEG-1 stereo decoders)  

More significant: **MPEG-2 AAC (ISO/IEC 13818-7)** from Fraunhofer, Dolby, Sony, AT&T. Better quality than MP3 at the same bitrate; full multichannel from the ground up. AAC became the audio core of MPEG-4.

## Part V: Codec wars

| Format | Notes |
|--------|-------|
| **RealAudio (1995)** | Proprietary streaming for dial-up; dominated early internet radio |
| **WMA (1999)** | Microsoft; competitive quality, heavy DRM; iPod did not support it |
| **Ogg Vorbis (2000)** | Xiph.Org; royalty-free; strong in games and niche streaming |
| **AAC** | MP3's commercial successor; iTunes, iOS, Android, MP4 default audio |

**AAC advantages over MP3:** pure MDCT (no hybrid bank), temporal noise shaping, flexible M/S per band, perceptual noise substitution, long-term prediction for speech. Transparency around **128 kbps** where MP3 often needs **160–192 kbps**.

**HE-AAC (aacPlus):** Spectral Band Replication + Parametric Stereo; viable at 24–48 kbps.

## Part VI: MPEG-4 (ecosystem, not one format)

MPEG-4 (ISO/IEC 14496, 1998+) aimed at interactive multimedia objects. Most of the interactive scene-graph vision saw limited adoption. What stuck: compression codecs and the container.

### Part 2 video: DivX era

**MPEG-4 Part 2** fit DVD-quality movies on 700 MB CD-Rs. **DivX** and open **Xvid** drove early-2000s `.avi` movie trading, parallel to MP3 for music. Later displaced by H.264.

### Part 10: H.264/AVC

**H.264 / AVC (2003):** joint ITU-T/MPEG work. Multiple reference frames, variable block motion, in-loop deblocking, CABAC. ~2:1 efficiency over Part 2. Universal baseline: YouTube, Netflix, Blu-ray, FaceTime, Zoom, phone cameras.

### QuickTime → MP4

**MP4** descends from **Apple QuickTime (1991)**. MPEG adopted QuickTime's atom/box structure:

- **Part 12:** ISO Base Media File Format (ISOBMFF)  
- **Part 14:** MP4 file format  

`.mov` and `.mp4` share lineage. **`.m4a`** is MP4 with audio only (usually AAC).

### Key MP4 boxes

| Box | Role |
|-----|------|
| `ftyp` | File type and compatibility brands |
| `moov` | Metadata, tracks, timing (must be readable before playback) |
| `mdat` | Compressed media bitstream |
| `trak` | Per-track description inside `moov` |
| `udta` | Title, artist, cover art (ecosystem-specific conventions) |

**Fragmented MP4 (fMP4):** small fragments for adaptive streaming (HLS, DASH). Netflix and YouTube use this.

## Part VII: After MP4

| Codec | Role |
|-------|------|
| **HEVC / H.265 (2013)** | ~2× H.264; 4K Blu-ray, streaming; messy patent pools slowed adoption |
| **AV1 (2018)** | AOMedia; royalty-free HEVC competitor; YouTube and Netflix adopted |
| **Opus (RFC 6716, 2012)** | Xiph + Skype; 6 kbps speech to 510 kbps music; WebRTC default |

## Summary table

| Format | Full name | Type | Standard | Introduced | Status |
|--------|-----------|------|----------|------------|--------|
| MP1 | MPEG-1 Audio Layer I | Lossy audio | ISO/IEC 11172-3 | 1993 | Obsolete |
| MP2 | MPEG-1 Audio Layer II | Lossy audio | ISO/IEC 11172-3 | 1993 | Active (broadcast) |
| MP3 | MPEG-1 Audio Layer III | Lossy audio | ISO/IEC 11172-3 | 1993 | Ubiquitous |
| AAC | MPEG-4 Audio Part 3 | Lossy audio | ISO/IEC 14496-3 | 1997 | Dominant digital |
| MP4 | MPEG-4 Part 14 | Container | ISO/IEC 14496-14 | 2001 | Dominant video box |
| H.264 | MPEG-4 Part 10 / AVC | Lossy video | ISO/IEC 14496-10 | 2003 | Universal baseline |

### Why MP3 still matters

Hundreds of millions of MP3 files accumulated between 1997 and 2015. Every platform still plays them. Patents expired. The spec is documented. MP3 sits beside JPEG and PDF as permanent infrastructure.

## Key people

| Name | Contribution |
|------|--------------|
| Leonardo Chiariglione | Founded and led MPEG from 1988 |
| Dieter Seitzer | Proposed perceptual coding for phone-line music |
| Karlheinz Brandenburg | Primary Layer III inventor (Fraunhofer) |
| Bernhard Grill | Fraunhofer MP3 and later AAC |
| Hendrik Fuchs | MUSICAM team (Layers I and II) |
| Justin Frankel | Winamp; brought MP3 to mass market |
| Shawn Fanning | Napster |
| Tomislav Uzelac | AMP decoder engine |

<details class="entry-fold">
<summary>Prompt an AI (MPEG audio history)</summary>
<div class="fold-body">
<p>Give the model this context:</p>
<ul>
<li>Which layer or format you care about (MP2 broadcast vs MP3 vs AAC vs MP4 container)</li>
<li>Whether you need technical depth (hybrid filter bank) or practical (bitrate, hosting)</li>
<li>Your use case: archive music, stream, encode library, build a player</li>
</ul>
<p>Sample prompt: <em>"Explain the difference between MP3, AAC, and MP4 for someone hosting a personal music library on a static site. Cover why MP3 files are smaller than WAV, what replaced MP3 for iTunes, and whether MP4 is a codec or a container."</em></p>
</div>
</details>

<details class="entry-fold">
<summary>Build it yourself (encode and inspect)</summary>
<div class="fold-body">
<p><strong>Encode MP3 with ffmpeg</strong> (LAME via libmp3lame; patents expired):</p>
<pre><code>ffmpeg -i input.wav -codec:a libmp3lame -b:a 192k output.mp3</code></pre>
<p><strong>Inspect format and bitrate:</strong></p>
<pre><code>ffprobe -hide_banner output.mp3</code></pre>
<p><strong>Read ID3 tags:</strong></p>
<pre><code>ffprobe -show_format -v quiet output.mp3</code></pre>
<p>For web playback after encoding, host files on R2 or similar and link with <code>&lt;audio src="…"&gt;</code>. See the <a href="#/e/cloudflare-r2-music-hosting">R2 music hosting entry</a>.</p>
</div>
</details>

## Live demo: PCM size calculator

Shows why compression was necessary. Enter minutes of stereo CD audio; see approximate uncompressed size vs 128 kbps MP3.

```demo PCM vs MP3 size (estimate)
<div id="pcm-demo" style="font-family:system-ui,sans-serif;max-width:360px;background:#0e1118;color:#e9eef6;padding:16px;border-radius:12px;">
  <label style="font-size:13px;display:block;margin-bottom:8px;">Duration (minutes)</label>
  <input id="pcm-min" type="number" min="0.5" step="0.5" value="3.5" style="width:100%;padding:8px;background:#141820;border:1px solid #2a3040;color:#e9eef6;border-radius:6px;font:inherit;margin-bottom:12px;" />
  <div id="pcm-out" style="font-size:14px;line-height:1.6;"></div>
</div>
<script>
function calc() {
  var min = parseFloat(document.getElementById("pcm-min").value) || 0;
  var pcmMB = min * 10;
  var mp3MB = (128 * 1000 * min * 60) / 8 / 1024 / 1024;
  document.getElementById("pcm-out").innerHTML =
    "<div><strong>CD PCM (stereo):</strong> ~" + pcmMB.toFixed(1) + " MB</div>" +
    "<div style='margin-top:6px;color:#7dffa3'><strong>MP3 @ 128 kbps:</strong> ~" + mp3MB.toFixed(1) + " MB</div>" +
    "<div style='margin-top:10px;font-size:12px;color:#888'>Ratio ~" + (pcmMB / mp3MB).toFixed(0) + ":1 (rough)</div>";
}
document.getElementById("pcm-min").addEventListener("input", calc);
calc();
</script>
```

*Preview block: static size comparison table. Demo block: interactive calculator for Part I math. Report source: operator expanded edition, June 2026.*
