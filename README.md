# Peter (with Photoshop Panel) 

## peter.justanothersystem.org

A web app that allows audience members to upload expiring images.

Uploaded images use AWS S3 for storage. They should be set to expire one day after deletion
in the bucket settings. imgix is used for displaying and resizing uploads.

## org.justanothersystem.peter-panel

The Photoshop panel code. Run the `macos_panel_setup.sh` script to install.
See also: https://github.com/Adobe-CEP/CEP-Resources The panel can be debugged in Chrome Developer Tools via the port
specified in `org.justanothersystem.julias-panel/.debug` file.
