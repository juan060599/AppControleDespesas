@echo off
REM Fix Capacitor Gradle proguard issues for Windows

echo Fixing Capacitor Gradle proguard configuration...

REM Use PowerShell to perform the replacements
powershell -Command "(Get-Content 'node_modules\@capacitor\android\capacitor\build.gradle') -replace 'proguard-android\.txt', 'proguard-android-optimize.txt' | Set-Content 'node_modules\@capacitor\android\capacitor\build.gradle'"

if exist "node_modules\@capacitor\preferences\android\build.gradle" (
    powershell -Command "(Get-Content 'node_modules\@capacitor\preferences\android\build.gradle') -replace 'proguard-android\.txt', 'proguard-android-optimize.txt' | Set-Content 'node_modules\@capacitor\preferences\android\build.gradle'"
)

echo Gradle proguard configuration fixed!
pause
