# YouTube Auto Ad Skipper Plug-in

**This was a quick side project**

> _Table of Content_
>
> - [Functionality](#what-dose-it-do)
> 
>   - [Reliability](#how-reliable-is-it)
> 
> - [Local Use](#how-to-use-it-loaclly)
>
> - [Future Work](#future-work)

---

## Functionality
This plug-in monitors YouTube tabs and automatically reacts to ad playback by:

- Muting the ad audio.

- Increasing playback speed to 10x.

- Skipping the ad after the countdown timer reaches zero.

Once the ad is finished or is skipped, the plugin restores the original playback speed and unmutes the audio.


### Reliability
Based on my testing, I got consistent results. Ads were detected and countermeasures where executed.

It works with ads at the beginning of a video, as well as, ads during a video.

However, one major breaking point is the dependency on YouTube DOM structure (nesting + class names) to function. **Therefore, functionality may be affected by changes in YouTube's DOM structure.**

## Local Use

The plug-in is **NOT** currently published on Chrom's Web Store; however, you can run it locally.
It is pretty easy, either  look up how to add/create a local plug-in, or do it manually

1. download the file,
2. go to the extensions manager on Google Chrome,
3. enable `developer mode`,
4. click `load unpacked`,
5. choose the directory you just downloaded.

 > Not tested, however, changing the location of the directory after adding it as a plug-in might make the plug-in undetected by Google Chomre.

## Future Work
1. Add pop-up for configuration.
2. Publish on Chrome Web Store.
3. Improve code and reliability.
