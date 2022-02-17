# mtax
A syntax meant to be both mobile-friendly and versatile.

## Why Mtax?
Mtax draws inspiration from excellent syntaxes like Markdown and BBCode, although these were designed when nearly all computers had full keyboards at their disposal. The “M” in mtax stands for Mobile: it aims to implement a Python-esque “less is more” design philosophy with mobile as well as desktop keyboards in mind, requiring fewer taps on the user’s part. At the same time, it implements a symbol-letter system to make mtax as versatile and feature-rich as it can be. 

Take, for instance, the asterisk: it’s one of the most well known and universal emphasis symbols, but on several standard phone models, it’s attained by navigating to symbols, then to more symbols. For mtax, putting text in bold, italic, underline, and even center alignment can be achieved through “$” and the style’s corresponding letter. The styling is closed by the same two characters, just in reverse. It’s only for more advanced styling, like highlighting text, when “secondary symbols” (such as #) come into play. 

## Basic Syntax
 -**$** is for basic text styling--bold, italic, underline, strikethrough--and is also used for links and for text alignment.
 -**#** is used for advanced text styling--color, highlighting, most things that need <span> elements or even functions--but must not use A-F to avoid conflict with hex codes.
 -**!** is used for media--images, audio, and video--and may possibly gain support for other visual or structural content in the future, such as tables.

## Full Syntax
| Syntax | Meaning | Example |
| --- | ----------- | --- |
| Basic Text Styling and Linking: |
| $b | Bold | $b BOLD TEXT b$ |
| $i | Italic | $i ITALIC TEXT i$
|$u|Underline|$u UNDERLINED TEXT u$ |
|$s|Strikethrough|$s STRIKETHROUGH TEXT s$ |
|$r|Right-align (creates its own paragraph)|$r RIGHT-ALIGNED TEXT r$|
|$c|Center-align (creates its own paragraph)|$c CENTER-ALIGNED TEXT c$|
|$l... (URL)|Link (keeps counting URL until first non-whitespace character)|$l LINK l$https://example.com|
||||
|Advanced Text Styling:|
|#t:(col)&|Tint (i.e. color)|#t:red& TINTED TEXT t# |
|#h:(col)&|Highlighting|#h:yellow& HIGHLIGHTED TEXT h# |
|#s|Spoiler (blurred until click)|#s SPOILER TEXT s# |
|#l|Long (i.e. expandable) text|#l LONG TEXT l# |
||||
|Working With Media:|
|!(alt)&(Image URL)|Alt text and image (image link must end with an image extention like .jpg, .webp, or .gif)|!ALT TEXT&https://example.com/example.jpg |
|!(Image URL)|Image without alt text (discouraged)|!https://example.com/example.jpg|
|!(Audio URL)|Audio (must end with an audio extention like .mp3 or .ogg)|!https://example.com/example.ogg|
|!(Video URL)|Video (must end with a video extention like .mp4 or .mov)|!https://example.com/example.mp4|
