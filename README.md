## Chrome Image Fallback
Image Fallback is a Google Chrome extension that allows you to specify a fallback host to retrieve images from if they cannot be found on the original host. This helps developers keep their image assets in sync between their local, staging and production environments. 

You can download this extension from the Chrome Web Store [here](https://chrome.google.com/webstore/detail/image-fallback/bdalekeapajlinfmggjofpajebfcdoke).

### Install
    git clone https://github.com/smilledge/chrome-image-fallback.git
    npm install

### Build
    grunt

### Limitations
 - Image urls within external stylesheets will not be replaced
