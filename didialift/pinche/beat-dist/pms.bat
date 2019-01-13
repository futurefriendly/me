rem @description Generate PMS file list
rem @example
rem call pms.bat BASEREVISION 

echo off

setlocal enabledelayedexpansion

set BASEREVISION=%1
set CHANGELISTFILE=_change.lst
set REPOPATH=""
set CURREVISION=""
set tmpfile=_tmp.tmp

svn up 
svn diff -r!BASEREVISION! | findstr "^Index:" | sort > !CHANGELISTFILE! 

svn info | findstr "^URL:" > %tmpfile%
for /f "tokens=2" %%i in (%tmpfile%) do set REPOPATH=%%i 

svn info | findstr "^Revision:" > %tmpfile%
for /f "tokens=2" %%i in (%tmpfile%) do set CURREVISION=%%i 

rem Trim last space
set REPOPATH=%REPOPATH:~0,-1%

rem cat !CHANGELISTFILE!

rem type %CHANGELISTFILE%

rem Grep items and remove duplicated items
for /f "tokens=2" %%i in (!CHANGELISTFILE!) do (
    if not "!LAST!"=="%%i" (
        if not "!LAST!"=="" (
            echo %REPOPATH%/%%i %CURREVISION%
        )
    )
    set LAST=%%i
)

del %CHANGELISTFILE%
del %tmpfile%

endlocal
