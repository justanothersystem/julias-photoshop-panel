#!/bin/bash

# Put Adobe Extensions Version 7 into debug mode.
defaults write com.adobe.CSXS.7 PlayerDebugMode 1

# Link panel build files to Adobe's extensions directory.
sudo ln -s "$PWD/org.justanothersystem.peter-panel" /Library/Application\ Support/Adobe/CEP/extensions/
