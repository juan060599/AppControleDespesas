#!/bin/bash

# Fix Capacitor Gradle proguard issues
echo "Fixing Capacitor Gradle proguard configuration..."

# Fix capacitor-android
sed -i "s/proguard-android\.txt/proguard-android-optimize.txt/g" node_modules/@capacitor/android/capacitor/build.gradle

# Fix capacitor-preferences if exists
if [ -f "node_modules/@capacitor/preferences/android/build.gradle" ]; then
    sed -i "s/proguard-android\.txt/proguard-android-optimize.txt/g" node_modules/@capacitor/preferences/android/build.gradle
fi

echo "Gradle proguard configuration fixed!"
