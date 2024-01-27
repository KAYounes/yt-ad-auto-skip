# YouTube Auto Ad Skipper Plugin

**Note -- This was a quick side project**

> _Table of Content_
>
> [What dose it do](#what-dose-it-do)
>
> [How reliable is it](#how-reliable-is-it)
>
> [How to use it loaclly](#how-to-use-it-loaclly)

---

## What dose it do

Well it moniters any YouTube tab, and as soon as an ad plays it dose the following:

1.  mute the ad,
2.  playback speed is set to 10,
3.  skips ad after countdown is over, if the ad is skippable.

After the ad is skipped/has finished everything should return to normal, i.e. playback speed and volume.

## How reliable is it

I am sure that it worked with me; however, I am not sure if I have covered all edge cases.

**Note -- the code depends on class names found in the YouTube DOM, so any changes to the class names will break the code.**

## How to use it loaclly

I did not uplaod the pluging on chrome web store; however, you can run it locally.
It is pretty east, you can look up how to create a local pluging, or

1. download the file,
2. go to extensions manager on chrome,
3. enable `developer mode`,
4. click `load unpacked`,
5. choose the direcotry you just downloaded.
